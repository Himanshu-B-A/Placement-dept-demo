// Mock Firebase — used only when demoMode is true (offline/demo use).
// With a real Firebase project connected, demoMode is always false
// and these functions are never called.

const mockStore = {};

const mockCollection = (collectionName) => ({
  _collection: collectionName
});

const mockDoc = (collectionName, docId) => ({
  _collection: collectionName,
  _id: docId || `mock_${Date.now()}`
});

const mockDb = {
  getDoc: async (ref) => {
    const key = `${ref._collection}/${ref._id}`;
    const data = mockStore[key];
    return {
      exists: () => !!data,
      data: () => data || null,
      id: ref._id
    };
  },

  getDocs: async (ref) => {
    const prefix = `${ref._collection}/`;
    const docs = Object.entries(mockStore)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, data]) => ({
        id: key.replace(prefix, ''),
        data: () => data,
        exists: () => true
      }));
    return { docs, forEach: (fn) => docs.forEach(fn) };
  },

  setDoc: async (ref, data) => {
    const key = `${ref._collection}/${ref._id}`;
    mockStore[key] = { ...data };
  },

  updateDoc: async (ref, data) => {
    const key = `${ref._collection}/${ref._id}`;
    mockStore[key] = { ...(mockStore[key] || {}), ...data };
  },

  deleteDoc: async (ref) => {
    const key = `${ref._collection}/${ref._id}`;
    delete mockStore[key];
  },

  addDoc: async (ref, data) => {
    const id = `mock_${Date.now()}`;
    const key = `${ref._collection}/${id}`;
    mockStore[key] = { ...data };
    return { id };
  }
};

export { mockCollection, mockDoc, mockDb };
