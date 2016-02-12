package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the added_inlinks database table.
 * 
 */
@Entity
@Table(name="added_inlinks")
@NamedQuery(name="AddedInlink.findAll", query="SELECT a FROM AddedInlink a")
public class AddedInlink implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private AddedInlinkPK id;

	public AddedInlink() {
	}

	public AddedInlinkPK getId() {
		return this.id;
	}

	public void setId(AddedInlinkPK id) {
		this.id = id;
	}

}