package de.mpg.mpi.inf.d5.yavi.server.entities;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the removed_outlinks database table.
 * 
 */
@Embeddable
public class RemovedOutlinkPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="page_id")
	private Integer pageId;

	@Column(name="day_number")
	private Integer dayNumber;

	private Integer outlink;

	public RemovedOutlinkPK() {
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
	public Integer getOutlink() {
		return this.outlink;
	}
	public void setOutlink(Integer outlink) {
		this.outlink = outlink;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof RemovedOutlinkPK)) {
			return false;
		}
		RemovedOutlinkPK castOther = (RemovedOutlinkPK)other;
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