package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_total_outlinks database table.
 * 
 */
@Entity
@Table(name="number_of_total_outlinks")
@NamedQuery(name="NumberOfTotalOutlinks.findAll", query="SELECT n FROM NumberOfTotalOutlinks n")
public class NumberOfTotalOutlinks implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfTotalOutlinksPK id;

	private Integer value;

	public NumberOfTotalOutlinks() {
	}

	public NumberOfTotalOutlinksPK getId() {
		return this.id;
	}

	public void setId(NumberOfTotalOutlinksPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}