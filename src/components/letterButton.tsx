import { TouchableOpacity, TouchableOpacityProps, Text, View } from "react-native"

type LetterButtonPros = TouchableOpacityProps & {
  character: String
}

export default function LetterButton(props: LetterButtonPros) {
  return (
      <TouchableOpacity 
        className="p-1 border-2 rounded-md m-1 w-16 flex-row justify-center bg-slate-700" 
        activeOpacity={.9}
        onPress={props.onPress}
      >
        <Text
          className="text-2xl m-3 font-bold text-center text-slate-300"
        >
        {props.character.toUpperCase()}
        </Text>
      </TouchableOpacity>
  )
}