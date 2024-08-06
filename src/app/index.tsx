import { useEffect, useState } from "react";
import { Text, View, TextInput, Platform, GestureResponderEvent } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation"
import LetterButton from "@/components/letterButton";
import { openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";
import { ToastAndroid, Alert } from "react-native";
import { displayToast } from "@/utils/toast";
import * as SQLite from 'expo-sqlite'
import DataBaseHandler from "@/database/database";
import { GestureHandlerEvent } from "react-native-reanimated/lib/typescript/reanimated2/hook";


export default function App() {
  const [sugestions, setSugestions] = useState(['Sugestão'])

  const db = SQLite.openDatabaseSync('noVerbalApp')
  let dbHandler: DataBaseHandler


  const [word, setWord] = useState('')
  const keyboard = [
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    ['h', 'i', 'j', 'k', 'l', 'm', 'n'],
    ['o', 'p', 'q', 'r', 's', 't', 'u'],
    ['v', 'w', 'x', 'y', 'z', '-', '+'],
  ]

  useEffect(() => {
    lockOrientation();
  }, [])
  
  useEffect(() => {
    dbHandler = new DataBaseHandler(db)
  }
  )

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    )
  }

  const letterButtonPress = (character: string) => {
    if (character === '-') {
      setWord(word.slice(0, -1))  
    } else if (character === '+') {
      if (word != ''){
        dbHandler.insertWordIntoDb(word)
        setWord('')
        setSugestions(['Sugestões'])
      } else {
        displayToast('Por favor, informe uma palavra')
      }
    } else {
      setWord(word + character)
    }
  }

  return (
    <View className="flex-1 flex-row justify-center items-center">
      <View className="ml-2">
      {
        keyboard.map((line, index) => {
          return <View
            className="flex-row"
            key={index}
          >
            {
              line.map(character => {
                return <LetterButton
                key={character}
                character={character}
                onPress={() => {
                  letterButtonPress(character)
                  const querySugetions = dbHandler.getSimilarWords(word + character)
                  setSugestions(querySugetions)
                  console.debug(querySugetions)
                }}
                >
                </LetterButton>
              })
            }
          </View>
        })
      }
      </View>
      <View className="flex-1 flex-col w-full h-full m-10 mt-48 align-top">
        <View
          className="justify-start items-center w-"
        >
          <TextInput
            className="border rounded w-full p-4 bg-slate-300"
            value={word}
            placeholder="A palavra aparecerá aqui"
          />
        </View>
        <View 
          className="flex flex-col items-start border rounded my-4 p-4 h-1/2 bg-slate-300"
        >
          {sugestions.map((sugestion, index) => {
            return <Text
            key={index}
             className="text-lg"
            >
             {sugestion}
            </Text>
          }
          

          )}
         
        </View>
      </View>
    </View>
  )
}