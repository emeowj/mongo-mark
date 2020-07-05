import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../api.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    selectedNote: null,
    notes: [],
    modifiedNoteIds: [],
  },
  mutations: {
    setNotes(state, notes) {
      state.notes = notes;
      state.selectedNote = notes[0];
    },
    setSelectedNote(state, note) {
      state.selectedNote = note;
    },
    updateNote(state, { note, buffer }) {
      const index = state.notes.findIndex((n) => n._id === note._id);
      if (index >= 0) {
        state.notes.splice(index, 1, note);
        if (state.selectedNote._id === note._id) {
          state.selectedNote = note;
        }
        const pendingIndex = state.modifiedNoteIds.findIndex(
          (id) => id === note._id
        );
        if (buffer && pendingIndex < 0) {
          state.modifiedNoteIds.push(note._id);
        } else if (!buffer && pendingIndex >= 0) {
          state.modifiedNoteIds.splice(pendingIndex, 1);
        }
      }
    },
    addNote(state, note) {
      state.notes.push(note);
      state.selectedNoteIndex = state.notes.length - 1;
    },
    deleteNote(state, noteId) {
      let index = state.notes.findIndex((note) => note._id === noteId);
      if (index < 0) {
        return;
      }
      state.notes.splice(index, 1);
      if (noteId === state.selectedNote._id) {
        if (index >= state.notes.length) {
          index = 0;
        }
        state.selectedNote = state.notes[index] || null;
      }
    },
    batchSave(state, { updated, failed }) {
      for (let i = 0; i < state.notes.length; i++) {
        const updatedNote = updated.get(state.notes[i]._id);
        if (updatedNote) {
          state.notes.splice(i, 1, updatedNote);
        }
      }
      state.modifiedNoteIds = Array.from(failed);
    },
  },
  getters: {
    notes: (state) => {
      return state.notes;
    },
    selectedNote: (state) => {
      return state.selectedNote;
    },
    hasUnsavedChanges: (state) => (noteId) => {
      return state.modifiedNoteIds.includes(noteId);
    },
  },
  actions: {
    init({ commit }) {
      axios.get('/notes').then((res) => {
        commit('setNotes', res.data);
      });
    },
    selectNote({ commit, state }, noteId) {
      const note = state.notes.find((note) => note._id === noteId);
      commit('setSelectedNote', note);
    },
    addNote({ commit }, note) {
      axios.put(`/note/`, note).then((res) => {
        const created = res.data;
        commit('addNote', created);
      });
    },
    updateNote({ commit }, { note, buffer }) {
      if (buffer) {
        commit('updateNote', { note, buffer });
        return;
      }
      axios.patch(`/note/${note._id}`, note).then((res) => {
        const updated = res.data;
        commit('updateNote', { note: updated, buffer: false });
      });
    },
    deleteNote({ commit }, noteId) {
      axios.delete(`/note/${noteId}`).then(() => {
        commit('deleteNote', noteId);
      });
    },
    batchSave({ commit, state }) {
      if (state.modifiedNoteIds.length === 0) {
        return;
      }
      const failed = new Set();
      const updated = new Map();
      Promise.allSettled(
        state.modifiedNoteIds.map((noteId) => {
          const note = state.notes.find((n) => n._id === noteId);
          return axios
            .patch(`/note/${noteId}`, note)
            .then((res) => {
              updated.set(noteId, res.data);
            })
            .catch(() => failed.add(noteId));
        })
      ).then(() => {
        commit('batchSave', { updated, failed });
      });
    },
  },
});
