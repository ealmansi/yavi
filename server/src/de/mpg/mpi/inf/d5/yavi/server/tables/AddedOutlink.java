package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the added_outlinks database table.
 * 
 */
@Entity
@Table(name="added_outlinks")
@NamedQuery(name="AddedOutlink.findAll", query="SELECT a FROM AddedOutlink a")
public class AddedOutlink implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private AddedOutlinkPK id;

	public AddedOutlink() {
	}

	public AddedOutlinkPK getId() {
		return this.id;
	}

	public void setId(AddedOutlinkPK id) {
		this.id = id;
	}

}