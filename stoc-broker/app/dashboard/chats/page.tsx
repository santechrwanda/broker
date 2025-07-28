"use client";
import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiMoreVertical, 
  FiInfo, 
  FiSmile, 
  FiSend
} from 'react-icons/fi';

const ChatInterface = () => {
  const [activeTab, setActiveTab] = useState('Chats');
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 1, name: 'Lisa Parker', avatar: 'LP', color: 'bg-cyan-200', status: 'online', unread: 0 },
    { id: 2, name: 'Frank Thomas', avatar: 'FT', color: 'bg-orange-200', status: 'offline', unread: 8 },
    { id: 3, name: 'Clifford Taylor', avatar: 'CT', color: 'bg-blue-500 text-white', status: 'offline', unread: 0 },
    { id: 4, name: 'Janette Caster', avatar: 'JC', color: 'bg-pink-200', status: 'offline', unread: 0 },
    { id: 5, name: 'Sarah Beattie', avatar: 'SB', color: 'bg-purple-200', status: 'offline', unread: 5 },
    { id: 6, name: 'Nellie Cornett', avatar: 'NC', color: 'bg-yellow-200', status: 'offline', unread: 2 },
    { id: 7, name: 'Chris Kiernan', avatar: 'CK', color: 'bg-cyan-500 text-white', status: 'offline', unread: 0 },
    { id: 8, name: 'Edith Evans', avatar: 'EE', color: 'bg-blue-200', status: 'offline', unread: 0 },
    { id: 9, name: 'Joseph Siegel', avatar: 'JS', color: 'bg-gray-200', status: 'offline', unread: 0 },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Lisa Parker',
      content: 'Good morning 😊',
      time: '09:07 am',
      isOwn: false,
      avatar: 'LP'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Good morning, How are you? What about our next meeting?',
      time: '09:08 am',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Lisa Parker',
      content: 'Yeah everything is fine. Our next meeting tomorrow at 10.00 AM',
      time: '',
      isOwn: false,
      avatar: 'LP'
    },
    {
      id: 4,
      sender: 'Lisa Parker',
      content: "Hey, I'm going to meet a friend of mine at the department store. I have to buy some presents for my parents 🎁.",
      time: '09:10 am',
      isOwn: false,
      avatar: 'LP'
    }
  ];

  return (
    <div className="flex absolute top-0 left-0 w-full h-[calc(100vh-5rem)] bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            <button className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center hover:bg-cyan-200">
              <FiPlus className="w-4 h-4 text-cyan-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['Chats', 'Contacts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-[#4da8c3]/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                contact.name === 'Lisa Parker' ? 'bg-cyan-50 border-r-2 border-cyan-500' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center text-sm font-medium mr-3`}>
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  {contact.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              LP
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lisa Parker</h3>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiInfo className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiMoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              {!msg.isOwn && (
                <div className="w-8 h-8 bg-cyan-200 rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                  {msg.avatar}
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-1' : ''}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-cyan-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.time && (
                  <p className={`text-xs text-gray-500 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FiSmile className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button className="w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center hover:bg-cyan-600">
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;