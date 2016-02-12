package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the added_outlinks database table.
 * 
 */
@Entity
@Table(name="added_outlinks")
@NamedQuery(name="AddedOutlinks.findAll", query="SELECT a FROM AddedOutlinks a")
public class AddedOutlinks implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private AddedOutlinksPK id;

	public AddedOutlinks() {
	}

	public AddedOutlinksPK getId() {
		return this.id;
	}

	public void setId(AddedOutlinksPK id) {
		this.id = id;
	}

}