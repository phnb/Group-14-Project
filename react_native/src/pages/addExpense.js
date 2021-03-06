import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';

// Add expense page implemented
const AddExpense = ({navigation, route}) => {
  var account_id = global.accountId;
  const dateNow = new Date();
  const currentDate = `${dateNow.getFullYear()}-${
    dateNow.getMonth() + 1
  }-${dateNow.getDate()}`;

  const [name, onChangeName] = React.useState('');
  const [amount, onChangeAmount] = React.useState('');
  const [date, onChangeDate] = React.useState('  ' + currentDate);
  const [note, onChangeNote] = React.useState('');
  const [type, onChangeType] = React.useState(true);
  const [border1, onChangeBorder1] = React.useState(false);
  const [border2, onChangeBorder2] = React.useState(false);
  const [border3, onChangeBorder3] = React.useState(false);
  const [border4, onChangeBorder4] = React.useState(false);
  const [refresh, OnchangeRefresh] = React.useState(true);

  let types = ['Income', 'Expense'];

  React.useEffect(() => {
    onChangeName('');
    onChangeAmount('');
    onChangeDate('  '+currentDate);
    onChangeNote('');
    onChangeType(true);
    onChangeBorder1(false);
    onChangeBorder2(false);
    onChangeBorder3(false);
    onChangeBorder4(false);
  },[refresh])

  // Submit new record to backend 
  function submit(type, name, amount, note, accountId){
    fetch('http://10.0.2.2:8000/app/record/', { 
      method: 'post',
      body: JSON.stringify({
        is_income: type,
        name: name,
        description: note,
        account_id: accountId,
        amount: amount,
        uid: global.uid,
        start_time: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': global.cookie,
      }
    }).then(response => {
      return response.json();
    })
    .then(function(data){
      OnchangeRefresh(!refresh);
      navigation.navigate("Home");
    });
  }
  
  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.addRecord}>ADD RECORD</Text>
      </View>
      <View style={group1.rectangle2}>
        <Text style={group2.name}>NAME</Text>
        <TextInput
          selectionColor={'rgba(66,150,144,255)'}
          style={[
            group2.inputName,
            {
              borderColor: border1
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
            },
          ]}
          onChangeText={text => onChangeName(text)}
          onFocus={() => onChangeBorder1(true)}
          onBlur={() => onChangeBorder1(false)}
          value={name}
        />
        <Text style={group2.amount}>AMOUNT</Text>
        <TextInput
          selectionColor={'rgba(66,150,144,255)'}
          style={[
            group2.inputAmount,
            {
              borderColor: border2
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
            },
          ]}
          onFocus={() => onChangeBorder2(true)}
          onBlur={() => onChangeBorder2(false)}
          onChangeText={text => onChangeAmount(text)}
          value={amount}
        />
        <Text style={group2.type}>TYPE</Text>
        <View style={group2.inputType}>
          <Button
            color={type ? 'rgba(37, 169, 105, 1)' : 'rgba(249, 91, 81, 1)'}
            title={type ? 'Income' : 'Expense'}
            onPress={() => onChangeType(!type)}
          />
        </View>
        <Text style={group2.date}>DATE</Text>
        <TextInput
          selectionColor={'rgba(66,150,144,255)'}
          style={[
            group2.inputDate,
            {
              borderColor: border3
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
            },
          ]}
          onFocus={() => onChangeBorder3(true)}
          onBlur={() => onChangeBorder3(false)}
          onChangeText={text => onChangeDate(text)}
          value={date}
        />
        <Text style={group2.remark}>REMARK</Text>
        <TextInput
          selectionColor={'rgba(66,150,144,255)'}
          multiline
          numberOfLines={3}
          style={[
            group2.inputNote,
            {
              borderColor: border4
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
            },
          ]}
          onFocus={() => onChangeBorder4(true)}
          onBlur={() => onChangeBorder4(false)}
          onChangeText={text => onChangeNote(text)}
          value={note}
        />
        <View style={group2.submit}>
          <Button
            color="rgba(63,135,130,255)"
            title="submit"
            style={group2.submitButton}
            onPress={() => submit(type, name, amount, note, global.accountId)}
          />
        </View>
      </View>
    </View>
  );
};

// Add record page UI style
const group1 = StyleSheet.create({
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 247,

    backgroundColor: 'rgba(66,150,144,255)',
  },
  addRecord: {
    /* Add Expense */
    position: 'absolute',
    width: 150,
    height: 30,
    top: 44,
    left: 130,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  rectangle2: {
    /* Rectangle 2 */
    position: 'absolute',
    width: 350,
    height: 500,
    top: 140,
    left: 32,

    backgroundColor: 'rgb(255, 255, 255)',
    elevation: 4,
    borderRadius: 20,
  },
});

const group2 = StyleSheet.create({
  name: {
    /* NAME */
    position: 'absolute',
    width: 100,
    height: 14,
    top: 30,
    left: 20,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  inputName: {
    position: 'absolute',
    width: 300,
    height: 40,
    top: 50,
    left: 20,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  amount: {
    /* Amount */
    position: 'absolute',
    width: 100,
    height: 14,
    top: 110,
    left: 140,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  inputAmount: {
    position: 'absolute',
    width: 180,
    height: 40,
    top: 130,
    left: 140,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  type: {
    /* NAME */
    position: 'absolute',
    width: 100,
    height: 14,
    top: 110,
    left: 20,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  inputType: {
    position: 'absolute',
    width: 80,
    height: 36,
    top: 130,
    left: 20,
    borderColor: 'rgb(211, 211, 211)',
    borderRadius: 8,
  },
  inputTypeSelect: {
    width: 140,
    height: 40,
  },
  date: {
    /* NAME */
    position: 'absolute',
    width: 100,
    height: 14,
    top: 190,
    left: 20,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  inputDate: {
    position: 'absolute',
    width: 300,
    height: 40,
    top: 210,
    left: 20,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  remark: {
    /* NAME */
    position: 'absolute',
    width: 100,
    height: 14,
    top: 270,
    left: 20,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  inputNote: {
    position: 'absolute',
    width: 300,
    height: 120,
    top: 290,
    left: 20,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  submit: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 430,
    left: 70,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  submitButton: {
    borderRadius: 40,
  },
});

export default AddExpense;
