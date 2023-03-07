import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import {firestore} from '../database';
import 'regenerator-runtime/runtime.js';

/** @class HttpService */
class HttpService {
  /**
   * @constructor Create a new instance of http service class
   * @param db - Data base
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * @description get the whole collection
   * @param {string} collectionName - The name of the collection with tasks
   * @return {Promise<*>} Entity
   */
  async get(collectionName) {
    return await getDocs(collection(firestore, collectionName))
        .then((res) => res.docs.map((doc) => doc.data()));
  }

  /**
   * @description Post entity
   * @param {string} collectionName - The name of the collection with tasks
   * * @param {any} entity -
   * @param {any} entity - Entity of the task
   * @return {Promise<*>} New entity
   */
  async post(collectionName, entity) {
    return await addDoc(collection(firestore, collectionName), entity);
  }

  /**
   * @description Put entity
   * @param {string} collectionName - The name of the collection with tasks
   * @param {any} entity - Entity of the task
   */
  async put(collectionName, entity) {
    await setDoc(doc(firestore, collectionName, entity.id), entity);
  }

  /**
   * @description Delete entity
   * @param {string} collectionName - The name of the collection with tasks
   * * @param {any} entity -
   * @param {any} entity - Entity of the task
   * @return {Promise<void>} Nothing
   */
  async delete(collectionName, entity) {
    await deleteDoc(doc(firestore, collectionName, entity.id), entity);
  }
}

export const httpService = new HttpService(firestore);

