'use client';

import { useMemo } from 'react';
import { Plate } from 'platejs/react';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import { createPlugins } from '@udecode/plate-core';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Button } from '@/components/ui/button';
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
import { Menu } from 'lucide-react';

import quotesJSON from './quotes.json';

// Side panel component
export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link"><Menu /></Button>
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

// Main Editor
export default function EditorDefault() {
  // Pick random quote once
  const initialValue = useMemo(() => {
    const random = Math.floor(Math.random() * quotesJSON.quotes.length);
    const { quote, author } = quotesJSON.quotes[random];

    return [
      {
        type: 'p',
        children: [{ text: `${quote}` }],
      },
      {
        type: 'p',
        children: [{ text: `- ${author}` }],
      },
    ];
  }, []);

  return (
    <Plate
      plugins={EditorKit}
      initialValue={initialValue}
    >
      <EditorContainer>
        <div className="flex flex-col items-center w-full">
          <Editor
            className="pt-[20vh] min-h-[80vh]"
            spellCheck={false}
          />
        </div>
      </EditorContainer>
      <div className="mt-4 fixed bottom-2 right-2">
        <div className='flex gap-2'>
          <SheetDemo />
        </div>
      </div>
    </Plate>
  );
}
