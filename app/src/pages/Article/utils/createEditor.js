import {schema} from "prosemirror-schema-basic"
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {receiveTransaction, collab} from "prosemirror-collab"
import {Schema, DOMParser} from "prosemirror-model"

const createEditor = (place, steps) => {
    console.log(steps)
    const domNode = document.getElementById(place)
    console.log(domNode)
    let view = new EditorView((domNode ? domNode : document.body), {
        state: EditorState.create({
          doc: DOMParser.fromSchema(schema).parse(document.querySelector("#"+place)),
          plugins: [collab({version: steps.length})],
          editable() {
            return false;
          },
        })
    })
    const users = steps.map(step => "admin")
    const transaction = receiveTransaction(view.state, steps, users)
    console.log(transaction)
    const newState = view.state.apply(transaction)
    view.updateState(newState)
    return view
}

export default createEditor