package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the removed_inlinks database table.
 * 
 */
@Entity
@Table(name="removed_inlinks")
@NamedQuery(name="RemovedInlink.findAll", query="SELECT r FROM RemovedInlink r")
public class RemovedInlink implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private RemovedInlinkPK id;

	public RemovedInlink() {
	}

	public RemovedInlinkPK getId() {
		return this.id;
	}

	public void setId(RemovedInlinkPK id) {
		this.id = id;
	}

}