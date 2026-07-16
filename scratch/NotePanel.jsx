  const NotePanel = () => {
    const [search, setSearch] = useState("");
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [contextMenuPos, setContextMenuPos] = useState(null);
    const [longPressedItem, setLongPressedItem] = useState(null);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [activeNote, setActiveNote] = useState(null);

    const allNotesAndFolders = allData.filter(e => (e.type === 'note' || e.type === 'folder'));
    
    // Hash routing for back button
    useEffect(() => {
      const handlePopState = () => {
        if (window.location.hash !== '#notes') {
          setActivePanel(p => p === 'note' ? null : p);
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const deleteRecursive = async (id, type) => {
      if (type === 'note') {
        await deleteFromFirebase(id);
      } else {
        const children = allData.filter(e => e.parentId === id && (e.type === 'note' || e.type === 'folder'));
        for (const child of children) {
          await deleteRecursive(child.id, child.type);
        }
        await deleteFromFirebase(id);
      }
    };

    const handleCreateFolder = async () => {
      if (!newFolderName.trim()) return;
      const id = generateId();
      await saveToFirebase(id, {
        type: 'folder',
        name: newFolderName.trim(),
        parentId: currentNoteFolderId,
        timestamp: Date.now()
      });
      setIsCreateFolderOpen(false);
      setNewFolderName("");
    };

    const handleRename = async () => {
      if (!renameValue.trim() || !longPressedItem) return;
      if (longPressedItem.type === 'folder') {
        await saveToFirebase(longPressedItem.id, { ...longPressedItem, name: renameValue.trim() });
      } else {
        await saveToFirebase(longPressedItem.id, { ...longPressedItem, content: renameValue.trim(), title: renameValue.trim() });
      }
      setIsRenameOpen(false);
      setLongPressedItem(null);
      setContextMenuPos(null);
    };

    const handleDelete = async (item) => {
      if (window.confirm(`Are you sure you want to delete this ${item.type}?`)) {
        await deleteRecursive(item.id, item.type);
        setLongPressedItem(null);
        setContextMenuPos(null);
      }
    };

    const handleNavigate = (folder) => {
      setCurrentNoteFolderId(folder.id);
      setNoteFolderPath([...noteFolderPath, folder]);
    };

    const handleNavigateUp = (index) => {
      if (index === -1) {
         setCurrentNoteFolderId(null);
         setNoteFolderPath([]);
      } else {
         const newPath = noteFolderPath.slice(0, index + 1);
         setCurrentNoteFolderId(newPath[newPath.length - 1].id);
         setNoteFolderPath(newPath);
      }
    };

    // Global Search vs Local items
    const isSearching = search.trim().length > 0;
    const currentItems = isSearching 
      ? allNotesAndFolders.filter(i => (i.name || i.content || i.title || i.phone || '').toLowerCase().includes(search.toLowerCase()))
      : allNotesAndFolders.filter(e => (e.parentId || null) === currentNoteFolderId).sort((a,b) => b.timestamp - a.timestamp);

    const folders = currentItems.filter(i => i.type === 'folder');
    const notes = currentItems.filter(i => i.type === 'note');

    const handleAddNote = () => {
      setActiveNote({ id: generateId(), type: 'note', parentId: currentNoteFolderId, title: '', content: '', timestamp: Date.now(), isNew: true });
    };

    const closeNotePanel = () => {
      window.history.back(); // This will pop '#notes' and trigger popstate
    };
    
    const getFolderCounts = (folderId) => {
      const children = allData.filter(e => e.parentId === folderId && (e.type === 'note' || e.type === 'folder'));
      let fCount = children.filter(c => c.type === 'folder').length;
      let nCount = children.filter(c => c.type === 'note').length;
      return { fCount, nCount };
    };

    const renderLinks = (text) => {
      if (!text) return null;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const phoneRegex = /(\+?\d{10,13})/g;
      const parts = text.split(new RegExp(`(${urlRegex.source}|${phoneRegex.source})`, 'gi')).filter(Boolean);
      return parts.map((part, i) => {
        if (part.match(urlRegex)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        if (part.match(phoneRegex)) return <a key={i} href={`tel:${part}`} className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        return <span key={i}>{part}</span>;
      });
    };

    if (activeNote) {
      return (
        <NoteEditor 
          note={activeNote} 
          onClose={() => setActiveNote(null)} 
          onSave={async (updated) => {
            await saveToFirebase(updated.id, {
               type: 'note',
               parentId: updated.parentId,
               title: updated.title,
               content: updated.content,
               timestamp: updated.isNew ? Date.now() : updated.timestamp,
            });
          }} 
        />
      );
    }

    return (
      <div className="absolute inset-0 bg-[#F4F4F4] z-[60] flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
        {/* Header / Toolbar */}
        <div className="pt-6 pb-2 px-4 flex justify-between items-center bg-[#F4F4F4] sticky top-0 z-20">
           <button onClick={closeNotePanel} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform">
             <Menu size={24} className="text-black/80" />
           </button>
           <div className="flex-1 px-4 max-w-[200px]">
             <div className="relative">
               <Search size={16} className="absolute left-2.5 top-2 text-black/40" />
               <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-black/5 rounded-full pl-8 pr-3 py-1.5 outline-none focus:bg-white focus:shadow-sm text-sm text-black transition-all" />
             </div>
           </div>
           <div className="flex gap-1">
             <button onClick={() => setIsCreateFolderOpen(true)} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform" title="Add Folder">
               <FolderPlus size={22} className="text-black/80" />
             </button>
           </div>
        </div>

        {/* Title Area */}
        {!isSearching && (
          <div className="px-6 py-2 flex flex-col items-center">
             <h1 className="text-3xl font-bold text-black mb-1 tracking-tight truncate max-w-[80vw]" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
               {noteFolderPath.length === 0 ? 'Folders' : noteFolderPath[noteFolderPath.length - 1].name}
             </h1>
             <p className="text-black/50 text-xs font-medium">
               {folders.length} {folders.length === 1 ? 'folder' : 'folders'}{notes.length > 0 && `, ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
             </p>
          </div>
        )}
        {isSearching && (
          <div className="px-6 py-2 flex flex-col items-center">
             <h1 className="text-xl font-bold text-black mb-1">Search Results</h1>
          </div>
        )}

        {/* Breadcrumbs */}
        {!isSearching && noteFolderPath.length > 0 && (
          <div className="px-4 py-2">
             <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap bg-black/5 px-3 py-2 rounded-2xl">
               <button onClick={() => handleNavigateUp(-1)} className="p-1 hover:bg-black/10 rounded-full flex items-center justify-center active:scale-95 transition-transform"><Home size={16} className="text-black/60"/></button>
               {noteFolderPath.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <ChevronRight size={14} className="text-black/30 shrink-0 mx-1" />
                    <button onClick={() => handleNavigateUp(i)} className={`font-medium px-2 py-1 rounded-lg hover:bg-black/10 truncate max-w-[120px] text-[14px] active:scale-95 transition-transform ${i === noteFolderPath.length - 1 ? 'text-black font-bold' : 'text-black/60'}`} style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
                      {f.name}
                    </button>
                  </React.Fragment>
               ))}
             </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[120px]">
           {/* Folders */}
           {folders.length > 0 && (
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
                {folders.map(folder => {
                   const { nCount, fCount } = getFolderCounts(folder.id);
                   const totalItems = nCount + fCount;
                   // Stable random color
                   const hash = folder.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                   const colorIdx = hash % 5;
                   // Tab colors mimicking the screenshot: yellow, blue, grey, red, etc.
                   const tabColors = ['#fbbc04', '#669df6', '#9e9e9e', '#f28b82', '#ccff90'];

                   return (
                     <div key={folder.id} 
                       className="relative select-none cursor-pointer active:scale-95 transition-transform group bg-transparent h-[100px]"
                       onContextMenu={(e) => {
                         e.preventDefault();
                         setLongPressedItem(folder);
                         setContextMenuPos({ x: e.clientX, y: e.clientY });
                       }}
                       onPointerDown={(e) => {
                         let timer = setTimeout(() => {
                           const rect = e.target.getBoundingClientRect();
                           setLongPressedItem(folder);
                           setContextMenuPos({ x: rect.left + rect.width/2, y: rect.bottom });
                         }, 500);
                         e.target.dataset.timer = timer;
                       }}
                       onPointerUp={(e) => {
                         clearTimeout(e.target.dataset.timer);
                         if (!longPressedItem) handleNavigate(folder);
                       }}
                       onPointerLeave={(e) => clearTimeout(e.target.dataset.timer)}
                     >
                       {/* SVG Tabbed Folder exactly matching screenshot */}
                       <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}>
                          <path d="M0,20 C0,12 6,8 14,8 L40,8 C45,8 48,11 50,15 L55,20 L86,20 C94,20 100,26 100,34 L100,86 C100,94 94,100 86,100 L14,100 C6,100 0,94 0,86 Z" fill="#ffffff" />
                          <path d="M50,15 L55,20 L86,20 C94,20 100,26 100,34 L100,20 C100,12 94,8 86,8 L60,8 C55,8 52,11 50,15 Z" fill={tabColors[colorIdx]} />
                       </svg>
                       <div className="absolute inset-0 p-3 pt-5 flex flex-col justify-between pointer-events-none">
                          <span className="text-[10px] font-bold text-black/40 ml-1">{totalItems}</span>
                          <span className="font-bold text-black/80 leading-tight text-sm line-clamp-2 pb-1 ml-1" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>{folder.name}</span>
                       </div>
                     </div>
                   );
                })}
             </div>
           )}

           {/* Notes */}
           {notes.length > 0 && (
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                {notes.map(note => (
                   <div key={note.id} 
                     className="bg-white rounded-[20px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] aspect-square relative select-none cursor-pointer active:scale-95 transition-transform flex flex-col border border-black/5"
                     onContextMenu={(e) => {
                       e.preventDefault();
                       setLongPressedItem(note);
                       setContextMenuPos({ x: e.clientX, y: e.clientY });
                     }}
                     onPointerDown={(e) => {
                       let timer = setTimeout(() => {
                           const rect = e.target.getBoundingClientRect();
                           setLongPressedItem(note);
                           setContextMenuPos({ x: rect.left + rect.width/2, y: rect.bottom });
                       }, 500);
                       e.target.dataset.timer = timer;
                     }}
                     onPointerUp={(e) => {
                       clearTimeout(e.target.dataset.timer);
                       if (!longPressedItem) {
                         setActiveNote(note);
                       }
                     }}
                     onPointerLeave={(e) => clearTimeout(e.target.dataset.timer)}
                   >
                      <h3 className="font-bold text-black text-xs line-clamp-1 mb-1" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>{note.title || 'Untitled'}</h3>
                      <p className="text-black/70 text-[10px] leading-relaxed line-clamp-4 overflow-hidden break-words" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
                        {note.content}
                      </p>
                      <p className="text-[9px] text-black/30 absolute bottom-3 left-3">{(new Date(note.timestamp)).toLocaleDateString('en-GB', {day: 'numeric', month:'short'})}</p>
                   </div>
                ))}
             </div>
           )}
           
           {allNotesAndFolders.length === 0 && !isSearching && (
             <div className="flex flex-col items-center justify-center h-[40vh] text-black/30">
                <Folder size={48} className="mb-3 opacity-30" />
                <p className="font-medium text-sm">No folders or notes yet</p>
             </div>
           )}
        </div>

        {/* FAB */}
        <button onClick={handleAddNote} className="absolute right-6 bottom-24 w-14 h-14 bg-white border border-black/10 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30">
          <Edit2 size={24} className="text-black" />
        </button>

        {/* Minimal Context Menu (Dropdown) */}
        <AnimatePresence>
          {longPressedItem && contextMenuPos && (
            <React.Fragment>
               <div className="fixed inset-0 z-[100]" onPointerDown={(e) => { e.stopPropagation(); setLongPressedItem(null); setContextMenuPos(null); }} />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="fixed z-[105] bg-white rounded-xl shadow-xl border border-black/5 py-1 min-w-[120px]"
                 style={{ 
                   left: Math.min(contextMenuPos.x, window.innerWidth - 130), 
                   top: Math.min(contextMenuPos.y, window.innerHeight - 100) 
                 }}
               >
                  <button onClick={() => {
                    setIsRenameOpen(true);
                    setRenameValue(longPressedItem.type === 'folder' ? longPressedItem.name : (longPressedItem.title || ''));
                  }} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm font-medium text-black flex items-center gap-2">
                    <Edit2 size={14}/> Rename
                  </button>
                  <div className="h-px bg-black/5 w-full my-1"/>
                  <button onClick={() => handleDelete(longPressedItem)} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2">
                    <Trash2 size={14}/> Delete
                  </button>
               </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {isCreateFolderOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-6" onClick={() => setIsCreateFolderOpen(false)}>
               <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-black mb-4">Create Folder</h2>
                 <input autoFocus type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name" className="w-full border-b-2 border-black/10 focus:border-black outline-none text-lg py-2 mb-6 font-medium" />
                 <div className="flex justify-end gap-2">
                   <button onClick={() => { setIsCreateFolderOpen(false); setNewFolderName(""); }} className="px-5 py-2.5 rounded-xl font-bold text-black/60 hover:bg-black/5">Cancel</button>
                   <button onClick={handleCreateFolder} className="px-5 py-2.5 rounded-xl font-bold text-white bg-black hover:bg-black/80">Create</button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rename Modal */}
        <AnimatePresence>
          {isRenameOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-6" onClick={() => setIsRenameOpen(false)}>
               <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-black mb-4">{longPressedItem?.type === 'folder' ? 'Rename Folder' : 'Rename Note'}</h2>
                 <input autoFocus type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="New name" className="w-full border-b-2 border-black/10 focus:border-black outline-none text-lg py-2 mb-6 font-medium" />
                 <div className="flex justify-end gap-2">
                   <button onClick={() => { setIsRenameOpen(false); setRenameValue(""); }} className="px-5 py-2.5 rounded-xl font-bold text-black/60 hover:bg-black/5">Cancel</button>
                   <button onClick={handleRename} className="px-5 py-2.5 rounded-xl font-bold text-white bg-black hover:bg-black/80">Save</button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const NoteEditor = ({ note, onSave, onClose }) => {
    const [title, setTitle] = useState(note.title || "");
    const [content, setContent] = useState(note.content || "");
    const [isEditing, setIsEditing] = useState(note.isNew || false);
    const textAreaRef = useRef(null);

    const handleSave = () => {
      onSave({ ...note, title: title.trim(), content: content.trim() });
      setIsEditing(false);
    };

    const handleBack = () => {
      if (isEditing) {
        handleSave();
      }
      onClose();
    };

    const addBullet = () => {
       if (!textAreaRef.current) return;
       const { selectionStart, selectionEnd } = textAreaRef.current;
       const newContent = content.substring(0, selectionStart) + "\n• " + content.substring(selectionEnd);
       setContent(newContent);
       setTimeout(() => {
         textAreaRef.current.focus();
         textAreaRef.current.setSelectionRange(selectionStart + 3, selectionStart + 3);
       }, 0);
    };

    const renderLinks = (text) => {
      if (!text) return null;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const phoneRegex = /(\+?\d{10,13})/g;
      const parts = text.split(new RegExp(`(${urlRegex.source}|${phoneRegex.source})`, 'gi')).filter(Boolean);
      return parts.map((part, i) => {
        if (part.match(urlRegex)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        if (part.match(phoneRegex)) return <a key={i} href={`tel:${part}`} className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        return <span key={i}>{part}</span>;
      });
    };

    return (
      <div className="absolute inset-0 bg-white z-[70] flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
         {/* Toolbar */}
         <div className="pt-6 pb-2 px-4 flex justify-between items-center bg-white sticky top-0 z-20 border-b border-black/5">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform flex items-center gap-1 text-black">
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="flex gap-2">
               {isEditing ? (
                 <React.Fragment>
                   <button onClick={addBullet} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform text-black/70" title="Bullet Point">
                     <ListTodo size={22} />
                   </button>
                   <button onClick={handleSave} className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold active:scale-95 transition-transform">
                     Done
                   </button>
                 </React.Fragment>
               ) : (
                 <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform text-black">
                   <Edit2 size={22} />
                 </button>
               )}
            </div>
         </div>

         {/* Editor Content */}
         <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[120px] bg-white flex flex-col">
            {isEditing ? (
               <input 
                 type="text" 
                 value={title} 
                 onChange={e => setTitle(e.target.value)} 
                 placeholder="Heading" 
                 className="w-full outline-none text-3xl font-bold text-black mb-6 bg-transparent" 
                 style={{ fontFamily: "'Noto Serif Malayalam', serif" }}
               />
            ) : (
               <h1 className="w-full text-3xl font-bold text-black mb-6" style={{ fontFamily: "'Noto Serif Malayalam', serif" }}>
                 {title || 'Untitled'}
               </h1>
            )}

            {isEditing ? (
               <textarea
                 ref={textAreaRef}
                 value={content}
                 onChange={e => setContent(e.target.value)}
                 placeholder="Type your note here..."
                 className="w-full flex-1 outline-none resize-none text-lg text-black/90 leading-relaxed bg-transparent"
                 style={{ fontFamily: "'Noto Serif Malayalam', serif" }}
               />
            ) : (
               <div 
                 className="w-full flex-1 text-lg text-black/90 leading-relaxed whitespace-pre-wrap"
                 style={{ fontFamily: "'Noto Serif Malayalam', serif" }}
                 onClick={() => setIsEditing(true)}
               >
                 {content ? renderLinks(content) : <span className="text-black/30">Tap to edit...</span>}
               </div>
            )}
         </div>
      </div>
    );
  };
