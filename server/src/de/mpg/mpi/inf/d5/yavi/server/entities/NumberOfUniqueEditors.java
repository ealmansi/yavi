package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the number_of_unique_editors database table.
 * 
 */
@Entity
@Table(name="number_of_unique_editors")
@NamedQuery(name="NumberOfUniqueEditors.findAll", query="SELECT n FROM NumberOfUniqueEditors n")
public class NumberOfUniqueEditors implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private NumberOfUniqueEditorsPK id;

	private Integer value;

	public NumberOfUniqueEditors() {
	}

	public NumberOfUniqueEditorsPK getId() {
		return this.id;
	}

	public void setId(NumberOfUniqueEditorsPK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}