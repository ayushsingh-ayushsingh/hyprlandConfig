'use client';

import { useState, useMemo } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

import quotesJSON from './quotes.json';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

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
        </div>
      </div>
    </Plate>
  );
}
