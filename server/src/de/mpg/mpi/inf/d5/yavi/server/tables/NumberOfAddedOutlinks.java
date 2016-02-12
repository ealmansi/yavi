package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_added_outlinks database table.
 * 
 */
@Entity
@Table(name="number_of_added_outlinks")
@NamedQuery(name="NumberOfAddedOutlinks.findAll", query="SELECT n FROM NumberOfAddedOutlinks n")
public class NumberOfAddedOutlinks implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfAddedOutlinksPK id;

	private Integer value;

	public NumberOfAddedOutlinks() {
	}

	public NumberOfAddedOutlinksPK getId() {
		return this.id;
	}

	public void setId(NumberOfAddedOutlinksPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}