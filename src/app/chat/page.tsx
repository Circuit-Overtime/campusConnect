"use client"
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, Bot } from "lucide-react";
import type { ChatContact, ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from '@/components/ui/card';
import { friendlyChat } from '@/ai/flows/friendly-chat-flow';
import { Skeleton } from '@/components/ui/skeleton';

const initialContacts: ChatContact[] = [
    { id: 'ai-friend', name: 'AI Friend', avatar: '', lastMessage: 'Here to help! What\'s up?', timestamp: 'Just now', online: true },
    { id: '1', name: 'Alice Johnson', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Hey, are you going to the tech talk?', timestamp: '10:42 AM', online: true },
    { id: '2', name: 'GDG Club Group', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Bob: Don\'t forget to RSVP!', timestamp: '9:30 AM', online: false },
    { id: '3', name: 'Professor Smith', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Your assignment has been graded.', timestamp: 'Yesterday', online: false },
    { id: '4', name: 'Study Group', avatar: 'https://placehold.co/100x100.png', lastMessage: 'You: Let\'s meet at the library at 4.', timestamp: 'Yesterday', online: true },
];

const initialMessages: { [key: string]: ChatMessage[] } = {
    'ai-friend': [
        { id: '1', sender: 'other', text: 'Hey bestie! What\'s on your mind? I\'m here for you.', timestamp: 'Just now' }
    ],
    '1': [
        { id: '1', sender: 'other', text: 'Hey, are you going to the tech talk?', timestamp: '10:42 AM' },
        { id: '2', sender: 'me', text: 'Yeah, I am! Sounds interesting. You?', timestamp: '10:43 AM' },
    ],
    '2': [
        { id: '1', sender: 'other', text: 'Bob: Don\'t forget to RSVP!', timestamp: '9:30 AM' },
    ],
    '3': [],
    '4': [],
};

export default function ChatPage() {
    const [contacts, setContacts] = useState(initialContacts);
    const [messages, setMessages] = useState(initialMessages);
    const [activeChat, setActiveChat] = useState<ChatContact>(initialContacts[0]);
    const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>(messages[activeChat.id]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [currentMessages]);


    const handleSelectChat = (contact: ChatContact) => {
        setActiveChat(contact);
        setCurrentMessages(messages[contact.id] || []);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'me',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedMessages = [...currentMessages, userMessage];
        setCurrentMessages(updatedMessages);
        setMessages(prev => ({...prev, [activeChat.id]: updatedMessages}));
        setNewMessage("");

        if (activeChat.id === 'ai-friend') {
            setIsTyping(true);
            try {
                const aiResponseText = await friendlyChat(newMessage);
                const aiMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'other',
                    text: aiResponseText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setCurrentMessages(prev => [...prev, aiMessage]);
                 setMessages(prev => ({...prev, [activeChat.id]: [...updatedMessages, aiMessage]}));
            } catch (error) {
                console.error("AI chat error:", error);
                 const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'other',
                    text: "Ugh, my brain just short-circuited. Try again in a bit?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setCurrentMessages(prev => [...prev, errorMessage]);
                 setMessages(prev => ({...prev, [activeChat.id]: [...updatedMessages, errorMessage]}));
            } finally {
                setIsTyping(false);
            }
        }
    }

    return (
        <Card className="h-[calc(100vh-12rem)] flex overflow-hidden">
            {/* Contacts Panel */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Chats</h2>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search contacts..." className="pl-9" />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {contacts.map((contact) => (
                        <div key={contact.id} onClick={() => handleSelectChat(contact)}
                            className={cn(
                                "flex items-center gap-4 p-3 cursor-pointer hover:bg-muted/50",
                                activeChat.id === contact.id && "bg-muted"
                            )}>
                            <Avatar className="relative">
                                {contact.id === 'ai-friend' ? (
                                    <div className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary'>
                                        <Bot className='h-5 w-5' />
                                    </div>
                                ) : (
                                    <>
                                     <AvatarImage src={contact.avatar} data-ai-hint="person face" />
                                     <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                    </>
                                )}
                                {contact.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate">{contact.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4">
                     <Avatar>
                        {activeChat.id === 'ai-friend' ? (
                            <div className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary'>
                                <Bot className='h-5 w-5' />
                            </div>
                        ) : (
                            <>
                                <AvatarImage src={activeChat.avatar} data-ai-hint="person face" />
                                <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                            </>
                        )}
                    </Avatar>
                    <div>
                        <h3 className="font-bold">{activeChat.name}</h3>
                        {activeChat.online && <p className="text-xs text-green-500">Online</p>}
                    </div>
                </div>

                <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto bg-secondary/30 space-y-4">
                    {currentMessages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'me' && 'justify-end')}>
                             {msg.sender === 'other' && (
                                 <Avatar className="h-8 w-8">
                                     {activeChat.id === 'ai-friend' ? (
                                        <div className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary'>
                                            <Bot className='h-4 w-4' />
                                        </div>
                                     ) : (
                                        <>
                                            <AvatarImage src={activeChat.avatar} data-ai-hint="person face"/><AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                                        </>
                                     )}
                                </Avatar>
                             )}
                            <div className={cn(
                                "max-w-xs md:max-w-md p-3 rounded-xl",
                                msg.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background rounded-bl-none'
                            )}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={cn("text-xs mt-1", msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex items-end gap-2">
                             <Avatar className="h-8 w-8">
                                <div className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary'>
                                    <Bot className='h-4 w-4' />
                                </div>
                            </Avatar>
                             <div className="bg-background rounded-bl-none p-3 rounded-xl">
                                <Skeleton className="h-4 w-16" />
                             </div>
                         </div>
                    )}
                </div>

                <div className="p-4 border-t bg-background">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-grow" 
                            disabled={isTyping && activeChat.id === 'ai-friend'}
                         />
                        <Button type="button" variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button type="submit" size="icon" disabled={isTyping && activeChat.id === 'ai-friend'}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </Card>
    );
}
