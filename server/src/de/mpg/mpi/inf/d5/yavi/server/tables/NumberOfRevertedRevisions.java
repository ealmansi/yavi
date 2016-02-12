package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_reverted_revisions database table.
 * 
 */
@Entity
@Table(name="number_of_reverted_revisions")
@NamedQuery(name="NumberOfRevertedRevisions.findAll", query="SELECT n FROM NumberOfRevertedRevisions n")
public class NumberOfRevertedRevisions implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfRevertedRevisionsPK id;

	private Integer value;

	public NumberOfRevertedRevisions() {
	}

	public NumberOfRevertedRevisionsPK getId() {
		return this.id;
	}

	public void setId(NumberOfRevertedRevisionsPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}