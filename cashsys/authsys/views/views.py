import imp
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from cashsys import settings
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from authsys.tokens import generate_token
from django.core.mail import EmailMessage, send_mail
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from authsys.models import *
from cashapp.models import *
from authsys.form import *
# login decorator
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
import json
# query stuffs
from django.db.models import Q


def register(request):
    """
    Register the user in Django user system, given registration information
    """
    if (request.method == "POST"):
        data = json.loads(request.body)
        unm = data["username"]
        fnm = data["firstname"]
        lnm = data["lastname"]
        em = data["email"]
        pw = data["password"]
        pw2 = data["confirmpassword"]

        # username already exists
        if User.objects.filter(username=unm):
            messages.error(request, "username already exists")
            return redirect("/auth/")

        # email already exists
        if User.objects.filter(email=em):
            messages.error(request, "email already exists")
            return redirect("/auth/")

        # user name length exceeding limit
        if len(unm) > 10:
            messages.error(request, "username should be less than 10")
            return redirect("/auth/")

        # password disagrees
        if pw!=pw2:
            messages.error(request, "pw didn't match")
            return redirect("/auth/")

        # username containing invalid characters
        if not unm.isalnum():
            messages.error(request, "username must be alpha-numeric")
            return redirect("/auth/")

        # inner user for credentials, outer user for profiles
        # create base user
        myusr = User.objects.create_user(unm, em, pw)
        myusr.first_name = fnm
        myusr.last_name = lnm
        myusr.is_active = False
        myusr.save()

        # create profile user
        usrprof = UserProfile.objects.create(user=myusr, first_name=fnm, last_name=lnm)
        usrprof.username = unm
        usrprof.email = em
        usrprof.save()
        messages.success(request, "successfully created, confirmation sent!")

        # welcome email
        subject = "Welcome!"
        message = "Hi boy " + myusr.first_name + "!! \n" + "Welcome much more!!!!"
        from_email = settings.EMAIL_HOST_USER
        to_list = [myusr.email]
        send_mail(subject, message, from_email, to_list, fail_silently=False)

        # comfirm email
        current_site = get_current_site(request)
        email_subject = "confirm your email - Django logging in !!!"
        message2 = render_to_string("email_confirmation.html",{
            "name": myusr.first_name,
            "domain": current_site.domain,
            "uid": urlsafe_base64_encode(force_bytes(myusr.pk)),
            "token": generate_token.make_token(myusr)
        })
        email = EmailMessage(
            email_subject,
            message2,
            settings.EMAIL_HOST_USER, # sender
            [myusr.email], # receiver
        )
        email.fail_silently=True
        email.send()

        return JsonResponse(status=200, data={"success": True})
    
    elif (request.method == "GET"):
        return render(request, "auth/reg.html")
    

# @api_view(["GET", 'PUT', "POST"])
def signin(request):
    """
    Sign in with user information inputed using Django's user module
    """
    if (request.method == "POST"):
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]

        usr = authenticate(username=username, password=password)
        if ((usr != None) and usr.is_active and usr.user_profile):
            # user valid, sign in using Django user module
            login(request, usr, backend='django.contrib.auth.backends.ModelBackend')

            # get default account's id
            try:
                defacc = usr.user_profile.accounts.get(is_default=True)
                defplan = usr.user_profile.plans.get(is_default=True)
                return JsonResponse(status=200, data={"success": True, "uid": usr.id, "default_account_id": defacc.id, "default_plan_id": defplan.id, "uname": usr.username, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url}) 
            except:
                # no default account or more than 1 accounts
                return JsonResponse(status=401, data={"success": False})

        else:
            # the user can be the superuser (which may not have profile, then an error should be reported)
            messages.error(request, "user does not exist, please register first")
            return JsonResponse(status=401, data={"success": False})


    elif (request.method == "GET"):
        if (request.user.is_authenticated):
            usr = request.user
            # avoid superuser from logging in from the normal interface 
            try: 
                prof = usr.user_profile
            except:
                return render(request, "auth/sgin.html")

            return render(request, "auth/sginsucc.html",{"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})
        else:
            return render(request, "auth/sgin.html")

@login_required
def signout(request):
    """
    Sign out
    """
    logout(request, backend='django.contrib.auth.backends.ModelBackend')
    messages.success(request, "Logged out successfully")
    return redirect("/auth/")


def reset_send_mail(request):
    """
    Send the verification email for the reset password functionality
    """
    if request.method == "POST":
        data = json.loads(request.body)
        email = data["email"]
        pw1 = data["pw1"]
        pw2 = data["pw2"]
        # check email-user existance
        try:
            usr = User.objects.get(email=email)
        except User.DoesNotExist:
            # no such user  
            messages.error(request, "no such user")
            return JsonResponse(status=401, data={"success": False})

        # only reset for valid user
        if usr.is_active:
            usr.user_profile.is_reset_active = True
            usr.user_profile.save()
            # send verification email
            current_site = get_current_site(request)
            email_subject = "confirm your email - Reset password"
            message2 = render_to_string("email_change_pw.html",{
                "name": usr.username,
                "domain": current_site.domain,
                "uid": urlsafe_base64_encode(force_bytes(usr.pk)),
                "token": generate_token.make_token(usr),
                "pw": urlsafe_base64_encode(force_bytes(pw1))
            })
            email_sent = EmailMessage(
                email_subject,
                message2,
                settings.EMAIL_HOST_USER, # sender
                [usr.email], # receiver
            )
            email_sent.fail_silently=True
            email_sent.send()

            return JsonResponse(status=201, data={"success": True, "username": usr.username, "uid": usr.id})
        else:
            # not activated: send error message
            messages.error(request, "user not activated yet.")
            return JsonResponse(status=401, data={"success": False})


def register_activate(request, uid64d, token):
    """
    Activate the registered account (with token-checking)
    """
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        return render(request, "activation_failed.html")

    # check token validity
    if ((myuser != None) and generate_token.check_token(myuser, token)):
        myuser.is_active = True
        myuser.save()
        login(request, myuser, backend='django.contrib.auth.backends.ModelBackend')

        # create default account for the new user (login, should be returned)
        if (not Account.objects.filter(Q(userProfile__id=myuser.user_profile.id)&Q(is_default=True))):
            defacc = Account(userProfile=myuser.user_profile)
            defacc.is_default = True
            defacc.name = myuser.username + "'s first account"
            defacc.description = myuser.username + "'s first account, hello world!"
            defacc.save()

        # create default plan for the new user (login, should be returned)
        if (not Plan.objects.filter(Q(userProfile__id=myuser.user_profile.id)&Q(is_default=True))):
            defplan = Plan(userProfile=myuser.user_profile, account=defacc)
            defplan.is_default = True
            defplan.name = myuser.username + "'s first plan"
            defplan.description = myuser.username + "'s first plan, hello world!"
            defplan.save()

        return render(request, "auth/sucver.html")
    else:
        return render(request, "activation_failed.html")


def reset_activate(request, uid64d, token, pw):
    """
    Activate the resetted password
    """
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        pw = force_text(urlsafe_base64_decode(pw))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        return render(request, "activation_failed.html")

    # reset the pw if the user exists
    if ((myuser != None) and generate_token.check_token(myuser, token)):
        # Only when token verification succeeded can you query the password reset web-page
        myuser.user_profile.is_reset_active = False
        myuser.user_profile.save()
        myuser.set_password(pw)
        myuser.save()
        return render(request, "resetpw/resetsucc.html")
    else:
        return render(request, "activation_failed.html")


def reset_pw(request):
    """
    Get the reset pw web page
    """
    if request.method == "GET":
        return render(request, "resetpw/resetpw.html")


@login_required
def profile(request):
    """
    Update the user profile (including the profile photo)
    """
    if request.method == "POST":
        # add new profile for the given user
        usr = User.objects.get(id=request.user.id)
        data = json.loads(request.body)
        print(data)
        try:
            unm = data["username"]
            email = data["email"]
            avatar_front_back_up = data["avatar"]
        except:
            return JsonResponse(status=401, data={"success": False})

        # create form for the convenience of update
        profForm = UserProfileForm(data, instance=usr.user_profile)
        usrForm = UserForm(data, instance=usr)
        # check update information validity
        if (profForm.is_valid() and usrForm.is_valid()):
            # update the existing user's form in the database
            profile = profForm.save(commit=False)
            
            # update avatar
            if 'avatar' in request.FILES:
                profile.avatar = request.FILES['avatar']
            
            # avatar link in the mobile, for back up
            profile.avatar_back_up = avatar_front_back_up
            profile.save()
            
            # update deep User
            usrForm.save()
            
            messages.success(request, "profile update successful!")
            return JsonResponse(status=201, data={"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarLink": avatar_front_back_up})
        return JsonResponse(status=401, data={"success": False})

    elif request.method == "GET":
        # get user profile information
        usr = request.user
        profForm = UserProfileForm(instance=request.user.user_profile)
        return JsonResponse(status=201, data={"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarLink": usr.user_profile.avatar_back_up})