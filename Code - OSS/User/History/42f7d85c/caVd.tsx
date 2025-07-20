'use client';

import { useState, useMemo } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

import quotesJSON from './quotes.json';

export default function EditorDefault() {
  const editor = usePlateEditor({ plugins: EditorKit });

  const initialQuote = useMemo(() => {
    const random = Math.floor(Math.random() * quotesJSON.quotes.length);
    const { quote, author } = quotesJSON.quotes[random];
    return `${quote}\n- ${author}`;
  }, []);

  const [placeholderText, setPlaceholderText] = useState(initialQuote);

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <ScrollArea className="h-[100vh] w-full rounded-md flex justify-center">
          <div className="flex flex-col items-center w-full">
            <Editor
              onClick={() => setPlaceholderText('')}
              placeholder={placeholderText}
              className="pt-[20vh] min-h-[80vh]"
              spellCheck={false}
            />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </EditorContainer>
      <div className="mt-4 fixed bottom-2 left-2">
        <div className='flex gap-2'>
          <Button>Here is a button</Button>
          <Button>Here is a button</Button>
        </div>
      </div>
    </Plate>
  );
}
