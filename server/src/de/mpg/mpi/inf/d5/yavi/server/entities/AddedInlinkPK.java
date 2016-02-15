package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the added_inlinks database table.
 * 
 */
@Embeddable
public class AddedInlinkPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="page_id")
	private Integer pageId;

	@Column(name="day_number")
	private Integer dayNumber;

	private Integer inlink;

	public AddedInlinkPK() {
	}
	public Integer getPageId() {
		return this.pageId;
	}
	public void setPageId(Integer pageId) {
		this.pageId = pageId;
	}
	public Integer getDayNumber() {
		return this.dayNumber;
	}
	public void setDayNumber(Integer dayNumber) {
		this.dayNumber = dayNumber;
	}
	public Integer getInlink() {
		return this.inlink;
	}
	public void setInlink(Integer inlink) {
		this.inlink = inlink;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof AddedInlinkPK)) {
			return false;
		}
		AddedInlinkPK castOther = (AddedInlinkPK)other;
		return 
			this.pageId.equals(castOther.pageId)
			&& this.dayNumber.equals(castOther.dayNumber)
			&& this.inlink.equals(castOther.inlink);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.pageId.hashCode();
		hash = hash * prime + this.dayNumber.hashCode();
		hash = hash * prime + this.inlink.hashCode();
		
		return hash;
	}
}