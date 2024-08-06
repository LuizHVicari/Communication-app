import { useEffect, useState } from "react";
import { Text, View, TextInput } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation"
import LetterButton from "@/components/letterButton";
import { getDBConnection, insertWordIntoDB } from "@/database/database";
import { SQLiteDatabase } from "react-native-sqlite-storage";

export default function App() {

  let db: SQLiteDatabase

  getDBConnection().then((result) => {
    db = result
  } )

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

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    )
  }

  const letterButtonPress = (c: string) => {
    if (c === '-') {
      setWord(word.slice(0, -1))
    } else if (c === '+') {
      insertWordIntoDB(db, word)
    } else {
      setWord(word + c)
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
                onPress={() => letterButtonPress(character)}
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
          className="flex flex-row items-start border rounded my-4 p-4 h-1/2 bg-slate-300"
        >
          <Text
            className="text-lg"
          >
            Sugestões:
          </Text>
        </View>
      </View>
    </View>
  )
}