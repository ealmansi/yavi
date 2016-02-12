package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_revisions database table.
 * 
 */
@Entity
@Table(name="number_of_revisions")
@NamedQuery(name="NumberOfRevisions.findAll", query="SELECT n FROM NumberOfRevisions n")
public class NumberOfRevisions implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfRevisionsPK id;

	private Integer value;

	public NumberOfRevisions() {
	}

	public NumberOfRevisionsPK getId() {
		return this.id;
	}

	public void setId(NumberOfRevisionsPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}