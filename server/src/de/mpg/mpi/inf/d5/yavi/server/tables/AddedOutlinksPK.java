package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the added_outlinks database table.
 * 
 */
@Embeddable
public class AddedOutlinksPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="page_id")
	private Long pageId;

	@Column(name="day_number")
	private Integer dayNumber;

	private Long outlink;

	public AddedOutlinksPK() {
	}
	public Long getPageId() {
		return this.pageId;
	}
	public void setPageId(Long pageId) {
		this.pageId = pageId;
	}
	public Integer getDayNumber() {
		return this.dayNumber;
	}
	public void setDayNumber(Integer dayNumber) {
		this.dayNumber = dayNumber;
	}
	public Long getOutlink() {
		return this.outlink;
	}
	public void setOutlink(Long outlink) {
		this.outlink = outlink;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof AddedOutlinksPK)) {
			return false;
		}
		AddedOutlinksPK castOther = (AddedOutlinksPK)other;
		return 
			this.pageId.equals(castOther.pageId)
			&& this.dayNumber.equals(castOther.dayNumber)
			&& this.outlink.equals(castOther.outlink);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.pageId.hashCode();
		hash = hash * prime + this.dayNumber.hashCode();
		hash = hash * prime + this.outlink.hashCode();
		
		return hash;
	}
}