import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClient } from "../../lib/supabaseClient";
import {
  Send,
  Search,
  MoreHorizontal,
  Image as ImageIcon,
  Paperclip,
  X,
  Smile,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
};

const Chat = () => {
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileAttachRef = useRef<HTMLInputElement>(null);

  // Fetch all users except self
  const fetchAllUsers = async () => {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("clerk_id", user?.id);

    if (!error && data) {
      setAllUsers(
        data.map((u) => ({
          id: u.clerk_id,
          name: u.name,
          email: u.email,
          imageUrl: u.image_url,
        }))
      );
    } else {
      console.error("Failed to fetch users:", error?.message);
    }
  };

  // Fetch messages between current user and selected user
  const fetchMessages = async (otherUserId: string) => {
    setLoadingMessages(true);
    const supabase = await getClient();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`
      )
      .order("timestamp", { ascending: true });

    if (!error && data) {
      setMessages(data);
    } else {
      console.error("Failed to fetch messages:", error?.message);
      setMessages([]);
    }

    setLoadingMessages(false);
  };

  // Handle sending message (with optional image/file)
  const handleSendMessage = async () => {
    if ((!message.trim() && !imageFile && !file) || !selectedUser) return;
    const supabase = await getClient();

    let image_url: string | undefined = undefined;
    let file_url: string | undefined = undefined;
    let file_name: string | undefined = undefined;

    // Upload image if present
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("chat-images")
        .upload(fileName, imageFile);

      if (error) {
        alert("Failed to upload image: " + error.message);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);
      image_url = urlData?.publicUrl;
    }

    // Upload file if present
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("chat-files")
        .upload(fileName, file);

      if (error) {
        alert("Failed to upload file: " + error.message);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("chat-files")
        .getPublicUrl(fileName);
      file_url = urlData?.publicUrl;
      file_name = file.name;
    }

    // Insert message
    const { error } = await supabase.from("messages").insert([
      {
        sender_id: user?.id,
        receiver_id: selectedUser.id,
        content: message,
        image_url,
        file_url,
        file_name,
      },
    ]);

    if (!error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender_id: user!.id,
          receiver_id: selectedUser.id,
          content: message,
          timestamp: new Date().toISOString(),
          image_url,
          file_url,
          file_name,
        },
      ]);
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
      setFile(null);
    } else {
      console.error("Failed to send message:", error.message);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    if (fileAttachRef.current) fileAttachRef.current.value = "";
  };

  // Emoji picker handler
  const handleEmoji = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchAllUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 tracking-tight">
            Chats
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border rounded-lg bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 outline-none transition"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.length === 0 && (
            <div className="p-6 text-gray-400 text-center">No users found.</div>
          )}
          {filteredUsers.map((userProfile) => (
            <div
              key={userProfile.id}
              onClick={() => setSelectedUser(userProfile)}
              className={`p-4 cursor-pointer border-b flex items-center gap-3 transition-colors ${
                selectedUser?.id === userProfile.id
                  ? "bg-blue-100 dark:bg-blue-900/60"
                  : "hover:bg-blue-50 dark:hover:bg-gray-800/60"
              }`}
            >
              {userProfile.imageUrl ? (
                <img
                  src={userProfile.imageUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 dark:from-blue-800 dark:to-blue-500 flex items-center justify-center text-base font-bold text-white shadow-md border-2 border-blue-300 dark:border-blue-700">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{userProfile.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {userProfile.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center min-h-[80px] bg-white/80 dark:bg-gray-900/80">
          {selectedUser ? (
            <div className="flex items-center gap-4">
              {selectedUser.imageUrl ? (
                <img
                  src={selectedUser.imageUrl}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 dark:from-blue-800 dark:to-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-lg border-2 border-blue-300 dark:border-blue-700">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <div className="text-xs text-gray-500">
                  {selectedUser.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-lg">
              Select a user to start chatting
            </div>
          )}
          <MoreHorizontal className="text-gray-400" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {selectedUser ? (
            loadingMessages ? (
              <div className="text-center text-gray-400">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow ${
                      msg.sender_id === user?.id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    {msg.image_url && (
                      <img
                        src={msg.image_url}
                        alt="attachment"
                        className="mb-2 max-h-48 rounded-lg border border-gray-400 dark:border-gray-700"
                      />
                    )}
                    {msg.file_url && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-300 underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        {msg.file_name || "Download file"}
                      </a>
                    )}
                    <p className="text-base">{msg.content}</p>
                    <p className="text-xs text-right mt-1 text-gray-300">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
              Select a user to start chatting
            </div>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="p-6 border-t flex items-center bg-white/80 dark:bg-gray-900/80 relative">
            {/* Emoji picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmoji((v) => !v)}
                className="mr-2 p-3 bg-yellow-50 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 text-yellow-600 dark:text-yellow-300 rounded-full shadow transition"
                title="Emoji"
                type="button"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmoji && (
                <div className="absolute z-10 bottom-14 left-0">
                  <EmojiPicker
                    theme={
                      document.documentElement.classList.contains("dark")
                        ? Theme.DARK
                        : Theme.LIGHT
                    }
                    onEmojiClick={handleEmoji}
                    width={320}
                    height={400}
                  />
                </div>
              )}
            </div>
            {/* Image preview */}
            {imagePreview && (
              <div className="relative mr-4">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                  title="Remove"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* File preview */}
            {file && (
              <div className="relative mr-4 flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                <Paperclip className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-300" />
                <span className="text-xs truncate max-w-[100px]">
                  {file.name}
                </span>
                <button
                  onClick={removeFile}
                  className="ml-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Remove"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* Attach image button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mr-2 p-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-full shadow transition"
              title="Attach image"
              type="button"
            >
              <ImageIcon className="w-5 h-5" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </button>
            {/* Attach file button */}
            <button
              onClick={() => fileAttachRef.current?.click()}
              className="mr-2 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full shadow transition"
              title="Attach file"
              type="button"
            >
              <Paperclip className="w-5 h-5" />
              <input
                ref={fileAttachRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 text-black dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 outline-none transition"
              disabled={!selectedUser}
            />
            <button
              onClick={handleSendMessage}
              disabled={
                (!message.trim() && !imageFile && !file) || !selectedUser
              }
              className="ml-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition disabled:opacity-50"
              type="button"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;