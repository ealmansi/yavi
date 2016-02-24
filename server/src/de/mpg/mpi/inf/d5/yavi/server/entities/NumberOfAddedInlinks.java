package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_added_inlinks database table.
 * 
 */
@Entity
@Table(name="number_of_added_inlinks")
@NamedQuery(name="NumberOfAddedInlinks.findAll", query="SELECT n FROM NumberOfAddedInlinks n")
public class NumberOfAddedInlinks implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfAddedInlinksPK id;

	private Integer value;

	public NumberOfAddedInlinks() {
	}

	public NumberOfAddedInlinksPK getId() {
		return this.id;
	}

	public void setId(NumberOfAddedInlinksPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}