import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import quotesJSON from "./quotes.json"
import { useState } from 'react';

export default function EditorDefault() {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  const quoteToDisplay = quotesJSON.quotes[Math.floor(Math.random() * quotesJSON.quotes.length)];

  const [placeholderText, setPlaceholderText] = useState(`${quoteToDisplay.quote} \n- ${quoteToDisplay.author}`)

  return (
    <div>
      <Plate editor={editor}>
        <EditorContainer>
          <ScrollArea className="h-[100vh] w-full rounded-md flex justify-center">
            <Editor onClick={() => {
              setPlaceholderText("")
            }} placeholder={`${placeholderText}`} className="pt-[20vh]" spellCheck="false" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          Button
        </EditorContainer>
      </Plate>
    </div>
  );
}

