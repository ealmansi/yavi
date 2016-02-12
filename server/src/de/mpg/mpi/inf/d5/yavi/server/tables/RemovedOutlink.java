package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the removed_outlinks database table.
 * 
 */
@Entity
@Table(name="removed_outlinks")
@NamedQuery(name="RemovedOutlink.findAll", query="SELECT r FROM RemovedOutlink r")
public class RemovedOutlink implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private RemovedOutlinkPK id;

	public RemovedOutlink() {
	}

	public RemovedOutlinkPK getId() {
		return this.id;
	}

	public void setId(RemovedOutlinkPK id) {
		this.id = id;
	}

}