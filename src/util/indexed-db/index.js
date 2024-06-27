/**
 * External dependencies
 */
import Dexie, { Table } from "dexie";

export class IndexedDB extends Dexie {
	simpleTable;
	profiles;

	constructor() {
		super( 'BrowserStorageComparison' );
		this.version( 1 ).stores({
			simpleTable: 'id',
			profiles: 'id',
		});
	}
}

export const db = new IndexedDB();