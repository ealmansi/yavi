package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the page_content_size database table.
 * 
 */
@Entity
@Table(name="page_content_size")
@NamedQuery(name="PageContentSize.findAll", query="SELECT p FROM PageContentSize p")
public class PageContentSize implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private PageContentSizePK id;

	private Integer value;

	public PageContentSize() {
	}

	public PageContentSizePK getId() {
		return this.id;
	}

	public void setId(PageContentSizePK id) {
		this.id = id;
	}

	public Integer getValue() {
		return this.value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

}