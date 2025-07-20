'use client';

// Reverted to your original import path
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

// SheetDemo remains the same
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
            Make changes to your profile here. Click save when you're done.
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

// The initial content for the editor
const initialValue = [
  {
    type: 'p', // 'p' for paragraph
    children: [{ text: 'Hello, world!' }],
  },
];

export default function EditorDefault() {
  // Pass the initialValue to the editor hook
  const editor = usePlateEditor({
    plugins: EditorKit,
    initialValue: initialValue,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <div className="flex flex-col items-center w-full">
          {/* Removed the placeholder and onClick props */}
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