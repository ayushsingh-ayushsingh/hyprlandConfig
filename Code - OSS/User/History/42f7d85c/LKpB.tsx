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

  const [quoteToDisplay, setQuoteToDisplay] = useState(quotesJSON.quotes[Math.floor(Math.random() * quotesJSON.quotes.length)]);

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <ScrollArea className="h-[100vh] w-full rounded-md flex justify-center">
          <Editor onClick={() => {
            setQuoteToDisplay("");
          }} placeholder={`${quoteToDisplay.quote} \n- ${quoteToDisplay.author}`} className="pt-[20vh]" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </EditorContainer>
    </Plate>
  );
}

