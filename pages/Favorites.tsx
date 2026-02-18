import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SavedPrompt, PromptFolder } from '../types';
import { 
    Bookmark, Search, Folder, FolderPlus, MoreVertical, 
    Trash2, FolderInput, Download, CheckSquare, Square, ArrowLeft, Copy
} from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [folders, setFolders] = useState<PromptFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showMoveModal, setShowMoveModal] = useState(false);

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user, selectedFolderId]);

  const fetchData = async () => {
      // Fetch Folders
      const { data: folderData } = await supabase.from('prompt_folders')
        .select('*').eq('user_id', user!.id).order('created_at', { ascending: true });
      if (folderData) setFolders(folderData as any);

      // Fetch Prompts
      let query = supabase.from('saved_prompts').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      
      if (selectedFolderId) {
          query = query.eq('folder_id', selectedFolderId);
      } 
      // Note: If no folder selected (All), ideally fetch all. 
      // Could filter by 'is null' for "Uncategorized" but UX usually shows 'All Items'
      
      const { data: promptData } = await query;
      if (promptData) setPrompts(promptData as any);
  };

  const createFolder = async () => {
      if (!newFolderName.trim()) return;
      await supabase.from('prompt_folders').insert([{ user_id: user!.id, name: newFolderName }]);
      setNewFolderName("");
      setShowCreateFolder(false);
      fetchData();
  };

  const toggleSelect = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
      if (confirm(`ลบ ${selectedIds.size} รายการ?`)) {
          await supabase.from('saved_prompts').delete().in('id', Array.from(selectedIds));
          setSelectedIds(new Set());
          setSelectMode(false);
          fetchData();
      }
  };

  const handleBulkMove = async (targetFolderId: string | null) => {
      await supabase.from('saved_prompts')
        .update({ folder_id: targetFolderId })
        .in('id', Array.from(selectedIds));
      setSelectedIds(new Set());
      setSelectMode(false);
      setShowMoveModal(false);
      fetchData();
  };

  const handleExport = () => {
      let markdown = `# My Saved Prompts\n\n`;
      prompts.forEach(p => {
          if (selectedFolderId && p.folder_id !== selectedFolderId) return;
          if (selectMode && !selectedIds.has(p.id)) return;
          
          markdown += `## ${p.title}\n`;
          markdown += `**Created:** ${new Date(p.created_at!).toLocaleDateString()}\n\n`;
          markdown += `\`\`\`\n${p.content}\n\`\`\`\n\n---\n\n`;
      });
      
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompts_export_${new Date().toISOString().split('T')[0]}.md`;
      a.click();
  };

  const filtered = prompts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return <div className="p-8 text-center text-white">Please Login</div>;

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
               <button onClick={() => navigate('/')} className="p-2"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Bookmark className="text-[#05F2F2] fill-[#05F2F2]" /> Library
               </h1>
           </div>
           
           <div className="flex gap-2">
               {selectMode ? (
                   <button onClick={() => setSelectMode(false)} className="text-[#FF4B4B] font-bold text-sm">Cancel</button>
               ) : (
                   <button onClick={() => setSelectMode(true)} className="text-[#05F2F2] text-sm">Select</button>
               )}
           </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6593A6]" size={20} />
           <input 
             type="text" 
             placeholder="ค้นหา Prompt..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#011627] border border-[#05F2F2]/30 rounded-xl pl-12 pr-4 py-3 text-[18px] text-white focus:border-[#05F2F2] outline-none"
           />
        </div>

        {/* Folders List */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button 
                onClick={() => setSelectedFolderId(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border transition-colors ${selectedFolderId === null ? 'bg-[#F27405] border-[#F27405] text-white' : 'bg-[#011627] border-white/10 text-[#6593A6]'}`}
            >
                All
            </button>
            {folders.map(folder => (
                <button 
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border transition-colors ${selectedFolderId === folder.id ? 'bg-[#F27405] border-[#F27405] text-white' : 'bg-[#011627] border-white/10 text-[#6593A6]'}`}
                >
                    <Folder size={14} /> {folder.name}
                </button>
            ))}
            <button onClick={() => setShowCreateFolder(true)} className="flex-shrink-0 w-10 h-9 rounded-lg bg-[#05F2F2]/10 flex items-center justify-center text-[#05F2F2] border border-[#05F2F2]/30">
                <FolderPlus size={18} />
            </button>
        </div>
      </header>

      {/* Bulk Action Bar */}
      {selectMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#011627] border-t border-[#05F2F2]/30 p-4 z-[60] flex justify-between items-center anim-slideUp">
              <span className="text-white text-sm">{selectedIds.size} Selected</span>
              <div className="flex gap-4">
                  <button onClick={handleExport} disabled={selectedIds.size === 0} className="flex flex-col items-center text-[#6593A6] disabled:opacity-50">
                      <Download size={20} /> <span className="text-[10px]">Export</span>
                  </button>
                  <button onClick={() => setShowMoveModal(true)} disabled={selectedIds.size === 0} className="flex flex-col items-center text-[#05F2F2] disabled:opacity-50">
                      <FolderInput size={20} /> <span className="text-[10px]">Move</span>
                  </button>
                  <button onClick={handleBulkDelete} disabled={selectedIds.size === 0} className="flex flex-col items-center text-[#FF4B4B] disabled:opacity-50">
                      <Trash2 size={20} /> <span className="text-[10px]">Delete</span>
                  </button>
              </div>
          </div>
      )}

      {/* Prompts List */}
      <div className="p-4 space-y-3">
           {filtered.map(fav => (
              <div 
                key={fav.id} 
                onClick={() => selectMode ? toggleSelect(fav.id) : null}
                className={`bg-[#011627]/80 border rounded-2xl p-4 transition-all relative ${selectedIds.has(fav.id) ? 'border-[#F27405] bg-[#F27405]/10' : 'border-[#05F2F2]/20'}`}
              >
                 {selectMode && (
                     <div className={`absolute top-4 right-4`}>
                         {selectedIds.has(fav.id) ? <CheckSquare className="text-[#F27405]" /> : <Square className="text-[#6593A6]" />}
                     </div>
                 )}
                 <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-lg font-bold text-white">{fav.title}</h3>
                 </div>
                 <p className="text-[#6593A6] text-sm line-clamp-2 mb-4 font-mono bg-[#010b14] p-2 rounded border border-white/5">
                    {fav.content}
                 </p>
                 {!selectMode && (
                     <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(fav.content)} className="flex-1 bg-[#012840] border border-white/10 h-[44px] rounded-lg flex items-center justify-center gap-2 text-sm text-white">
                           <Copy size={16} /> Copy
                        </button>
                     </div>
                 )}
              </div>
           ))}
      </div>

      {/* Modals */}
      {showCreateFolder && (
          <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6">
              <div className="bg-[#011627] w-full max-w-sm rounded-2xl p-6 border border-[#05F2F2]/30">
                  <h3 className="text-white font-bold text-lg mb-4">Create Folder</h3>
                  <input 
                    autoFocus
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder="Folder Name"
                    className="w-full bg-[#012840] p-3 rounded-lg text-white border border-white/10 mb-4 focus:border-[#F27405] outline-none"
                  />
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowCreateFolder(false)} className="text-[#6593A6]">Cancel</button>
                      <button onClick={createFolder} className="text-[#05F2F2] font-bold">Create</button>
                  </div>
              </div>
          </div>
      )}

      {showMoveModal && (
          <div className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center sm:p-6">
              <div className="bg-[#011627] w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 border-t sm:border border-[#05F2F2]/30 anim-slideUp">
                  <h3 className="text-white font-bold text-lg mb-4">Move to...</h3>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                      <button 
                        onClick={() => handleBulkMove(null)} 
                        className="w-full p-3 text-left text-white bg-[#012840] rounded-lg border border-white/10"
                      >
                          All Prompts (Uncategorized)
                      </button>
                      {folders.map(f => (
                          <button 
                            key={f.id}
                            onClick={() => handleBulkMove(f.id)} 
                            className="w-full p-3 text-left text-white bg-[#012840] rounded-lg border border-white/10 flex items-center gap-2"
                          >
                              <Folder size={16} /> {f.name}
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowMoveModal(false)} className="w-full mt-4 py-3 text-[#6593A6]">Cancel</button>
              </div>
          </div>
      )}

    </div>
  );
};

export default Favorites;
