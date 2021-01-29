import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';



const conversion_rate_init = [
  {unit: 'Currency', value: 0}
];

export default function App() {
  const [result, setResult] = useState(0);
  const [money, setMoney] = useState('0');
  
  const [currency, setCurrency] = useState('Currency');
  const [conversion_rate, setConversion_rate] = useState([]);



  const init = () => {

    const url=  'https://api.exchangeratesapi.io/latest';


    fetch(url)
    .then((response) => response.json()) 
    .then((responseJson) => {
      
      const arrObj = responseJson.rates;
      const arr = Object.keys(arrObj).map(key => ({unit: key, value: arrObj[key]}));
      arr.sort( (a,b) => (a.unit > b.unit) ); 

      setConversion_rate([...conversion_rate_init, ...arr]);
      
    })
    .catch((error) => {
      setConversion_rate(conversion_rate_init);
      Alert.alert('Error', error);
    });


  }

  function getValue(curr) {

    let arr = conversion_rate;
    for (let i=0; i<arr.length; i++) {
        if (arr[i].unit == curr)
          return arr[i].value;
    }

    return 0;

  }

  useEffect( () => {
    init();
  },[]);




  return (
    <View style={styles.container}>
      
      <View style={styles.results} >
        <View>
          <Image style={styles.coinPicture} source={require('./img/euro-400249_960_720.jpeg')} />
        </View>
        <Text style={{fontSize: 30}}>{result} €</Text>
      </View>

      <View style={styles.currencyStyle} >
        
         
         <TextInput style={styles.nfield} keyboardType = 'numeric'  onChangeText={money => setMoney(money)} value={money} />
         
        <Picker
            
            selectedValue={currency}
            style={styles.pickerStyle}
            itemStyle={styles.litem}
            onValueChange={(itemValue, itemIndex) => {
              if (itemIndex != 0) {
                setCurrency(itemValue);

                if (money == null || money.trim() == '') {
                  setResult(0);
                  return;
                }

                setResult( Math.round( 100 * Number(money) / getValue(itemValue)) / 100.0 );
                
                
              }
            }}>
            {conversion_rate.map(data => (<Picker.Item label={data.unit} value={data.unit} key={data.unit} />))}
        </Picker>
        
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36,
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  results : {
    flex: 4/6,
    display: 'flex',
    fontSize: 20,
    width: '95%',
    justifyContent: 'flex-end',
    alignItems: 'center'

  },
  coinPicture : {
    width: 200,
    height: 200

  },
  currencyStyle : {
    flex: 2/6,    
    flexDirection: 'row',   
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
  pickerStyle : {   
    height: 50, 
    width: 100,
    alignSelf: 'flex-start',
    marginLeft: 20
  
  },
  litem : {   
    textAlign: 'center'
  },
  nfield: {  
    width: 80, 
    borderColor: 'gray', 
    borderWidth: 1,
    fontSize: 20,
    alignSelf: 'flex-start'

  },
});