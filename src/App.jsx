import { useState, useEffect } from "react";
import { 
  Search, 
  Menu,
  X as Close,
  SendHorizontal, 
  Edit2, 
  Trash2, 
  MessageSquarePlus,
  Sparkles,
  MoreVertical,
  Home,
  Star,
  Archive,
  Tag,
  Settings,
  HelpCircle,
  Moon
} from "lucide-react";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.note-actions')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/fetch");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      await fetch("http://localhost:9000/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: newItem })
      });
      setNewItem("");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const editItem = async (id) => {
    if (!editingValue.trim()) return;
    try {
      await fetch(`http://localhost:9000/api/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: editingValue })
      });
      setEditingId(null);
      setEditingValue("");
      fetchItems();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`http://localhost:9000/api/delete/${id}`, {
        method: "DELETE"
      });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addItem();
    }
  };

  const sidebarSections = [
    {
      title: "Main",
      items: [
        { id: 'home', label: 'All Notes', icon: Home },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'archived', label: 'Archived', icon: Archive },
      ]
    },
    {
      title: "Tags",
      items: [
        { id: 'personal', label: 'Personal', icon: Tag, color: 'text-purple-500' },
        { id: 'work', label: 'Work', icon: Tag, color: 'text-blue-500' },
        { id: 'ideas', label: 'Ideas', icon: Tag, color: 'text-green-500' },
      ]
    },
    {
      title: "Other",
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
      ]
    }
  ];

  const filteredItems = items.filter(item => 
    item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation - Mobile */}
      <div className={`md:hidden px-4 py-3 flex items-center justify-between ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Menu className={`h-6 w-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
        </button>
        <span className={`font-semibold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Bucket
        </span>
        <div className="w-10" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-0 left-0 w-72 z-50 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          border-r
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className={`hidden md:flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <MessageSquarePlus className="h-6 w-6 text-blue-600" />
                <span className={`font-semibold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bucket
                </span>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Moon className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              </button>
            </div>

            {/* Mobile Close Button */}
            {isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className={`md:hidden absolute top-4 right-4 p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Close className={`h-6 w-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              </button>
            )}

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {sidebarSections.map((section) => (
                <div key={section.title} className="py-4">
                  <h3 className={`px-4 mb-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {section.title}
                  </h3>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        activeSection === item.id
                          ? isDarkMode 
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color || ''}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with ❤️ by Venu Kumar
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Header */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search your notes..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto p-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    No notes yet
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Start by adding your first note below!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`rounded-xl transition-all duration-200 group ${
                        isDarkMode
                          ? 'bg-gray-800 hover:bg-gray-750'
                          : 'bg-white hover:shadow-md shadow-sm'
                      }`}
                    >
                      <div className="p-4">
                        {editingId === item.id ? (
                          <div className="space-y-3">
                            <textarea
                              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                isDarkMode
                                  ? 'bg-gray-700 text-white border-gray-600'
                                  : 'bg-gray-50 text-gray-900 border-transparent'
                              }`}
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              rows="3"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  isDarkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingValue("");
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                onClick={() => editItem(item.id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <p className={`whitespace-pre-wrap flex-1 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                {item.item}
                              </p>
                              <div className="relative note-actions">
                                <button
                                  className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                                    isDarkMode
                                      ? 'hover:bg-gray-700'
                                      : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                >
                                  <MoreVertical className={`h-5 w-5 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`} />
                                </button>
                                {activeDropdown === item.id && (
                                  <div className={`absolute right-0 top-8 w-48 rounded-lg shadow-lg border py-1 z-10 ${
                                    isDarkMode
                                      ? 'bg-gray-800 border-gray-700'
                                      : 'bg-white border-gray-200'
                                  }`}>
                                    <button
                                      className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                                        isDarkMode
                                          ? 'hover:bg-gray-700 text-gray-200'
                                          : 'hover:bg-gray-50 text-gray-700'
                                      }`}
                                      onClick={() => {
                                        setEditingId(item.id);
                                        setEditingValue(item.item);
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                      Edit
                                    </button>
                                    <button
                                      className={`w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 ${
                                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                      }`}
                                      onClick={() => {
                                        deleteItem(item.id);
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t flex items-center justify-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="max-w-3xl mx-auto w-full flex items-center">
              <textarea
                className={`w-full p-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none flex-1 h-12  ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 border-transparent placeholder-gray-500'
                }`}
                placeholder="Type your note here... (Press Enter to save)"
                rows="1"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className={`ml-2 p-2 rounded-lg transition-all duration-200 ${
                  newItem.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={addItem}
                disabled={!newItem.trim()}
              >
                <SendHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
