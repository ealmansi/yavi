package de.mpg.mpi.inf.d5.yavi.server.tables;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the number_of_total_outlinks database table.
 * 
 */
@Embeddable
public class NumberOfTotalOutlinksPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="page_id")
	private Integer pageId;

	@Column(name="day_number")
	private Integer dayNumber;

	public NumberOfTotalOutlinksPK() {
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

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof NumberOfTotalOutlinksPK)) {
			return false;
		}
		NumberOfTotalOutlinksPK castOther = (NumberOfTotalOutlinksPK)other;
		return 
			this.pageId.equals(castOther.pageId)
			&& this.dayNumber.equals(castOther.dayNumber);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.pageId.hashCode();
		hash = hash * prime + this.dayNumber.hashCode();
		
		return hash;
	}
}