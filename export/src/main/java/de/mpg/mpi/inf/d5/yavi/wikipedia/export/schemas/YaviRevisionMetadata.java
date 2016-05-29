/**
 * Autogenerated by Avro
 *
 * DO NOT EDIT DIRECTLY
 */
package de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas;

import org.apache.avro.specific.SpecificData;

@SuppressWarnings("all")
@org.apache.avro.specific.AvroGenerated
public class YaviRevisionMetadata extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  private static final long serialVersionUID = -7256365069835508405L;
  public static final org.apache.avro.Schema SCHEMA$ = new org.apache.avro.Schema.Parser().parse("{\"type\":\"record\",\"name\":\"YaviRevisionMetadata\",\"namespace\":\"de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas\",\"fields\":[{\"name\":\"page_id\",\"type\":[\"null\",\"long\"]},{\"name\":\"revision_id\",\"type\":[\"null\",\"long\"]},{\"name\":\"day_number\",\"type\":[\"null\",\"int\"]},{\"name\":\"contributor_hash\",\"type\":[\"null\",\"int\"]},{\"name\":\"text_size\",\"type\":[\"null\",\"long\"]},{\"name\":\"parent_revision_id\",\"type\":[\"null\",\"long\"]},{\"name\":\"sha1\",\"type\":[\"null\",\"string\"]}]}");
  public static org.apache.avro.Schema getClassSchema() { return SCHEMA$; }
  @Deprecated public java.lang.Long page_id;
  @Deprecated public java.lang.Long revision_id;
  @Deprecated public java.lang.Integer day_number;
  @Deprecated public java.lang.Integer contributor_hash;
  @Deprecated public java.lang.Long text_size;
  @Deprecated public java.lang.Long parent_revision_id;
  @Deprecated public java.lang.CharSequence sha1;

  /**
   * Default constructor.  Note that this does not initialize fields
   * to their default values from the schema.  If that is desired then
   * one should use <code>newBuilder()</code>.
   */
  public YaviRevisionMetadata() {}

  /**
   * All-args constructor.
   * @param page_id The new value for page_id
   * @param revision_id The new value for revision_id
   * @param day_number The new value for day_number
   * @param contributor_hash The new value for contributor_hash
   * @param text_size The new value for text_size
   * @param parent_revision_id The new value for parent_revision_id
   * @param sha1 The new value for sha1
   */
  public YaviRevisionMetadata(java.lang.Long page_id, java.lang.Long revision_id, java.lang.Integer day_number, java.lang.Integer contributor_hash, java.lang.Long text_size, java.lang.Long parent_revision_id, java.lang.CharSequence sha1) {
    this.page_id = page_id;
    this.revision_id = revision_id;
    this.day_number = day_number;
    this.contributor_hash = contributor_hash;
    this.text_size = text_size;
    this.parent_revision_id = parent_revision_id;
    this.sha1 = sha1;
  }

  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call.
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return page_id;
    case 1: return revision_id;
    case 2: return day_number;
    case 3: return contributor_hash;
    case 4: return text_size;
    case 5: return parent_revision_id;
    case 6: return sha1;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }

  // Used by DatumReader.  Applications should not call.
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: page_id = (java.lang.Long)value$; break;
    case 1: revision_id = (java.lang.Long)value$; break;
    case 2: day_number = (java.lang.Integer)value$; break;
    case 3: contributor_hash = (java.lang.Integer)value$; break;
    case 4: text_size = (java.lang.Long)value$; break;
    case 5: parent_revision_id = (java.lang.Long)value$; break;
    case 6: sha1 = (java.lang.CharSequence)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }

  /**
   * Gets the value of the 'page_id' field.
   * @return The value of the 'page_id' field.
   */
  public java.lang.Long getPageId() {
    return page_id;
  }

  /**
   * Sets the value of the 'page_id' field.
   * @param value the value to set.
   */
  public void setPageId(java.lang.Long value) {
    this.page_id = value;
  }

  /**
   * Gets the value of the 'revision_id' field.
   * @return The value of the 'revision_id' field.
   */
  public java.lang.Long getRevisionId() {
    return revision_id;
  }

  /**
   * Sets the value of the 'revision_id' field.
   * @param value the value to set.
   */
  public void setRevisionId(java.lang.Long value) {
    this.revision_id = value;
  }

  /**
   * Gets the value of the 'day_number' field.
   * @return The value of the 'day_number' field.
   */
  public java.lang.Integer getDayNumber() {
    return day_number;
  }

  /**
   * Sets the value of the 'day_number' field.
   * @param value the value to set.
   */
  public void setDayNumber(java.lang.Integer value) {
    this.day_number = value;
  }

  /**
   * Gets the value of the 'contributor_hash' field.
   * @return The value of the 'contributor_hash' field.
   */
  public java.lang.Integer getContributorHash() {
    return contributor_hash;
  }

  /**
   * Sets the value of the 'contributor_hash' field.
   * @param value the value to set.
   */
  public void setContributorHash(java.lang.Integer value) {
    this.contributor_hash = value;
  }

  /**
   * Gets the value of the 'text_size' field.
   * @return The value of the 'text_size' field.
   */
  public java.lang.Long getTextSize() {
    return text_size;
  }

  /**
   * Sets the value of the 'text_size' field.
   * @param value the value to set.
   */
  public void setTextSize(java.lang.Long value) {
    this.text_size = value;
  }

  /**
   * Gets the value of the 'parent_revision_id' field.
   * @return The value of the 'parent_revision_id' field.
   */
  public java.lang.Long getParentRevisionId() {
    return parent_revision_id;
  }

  /**
   * Sets the value of the 'parent_revision_id' field.
   * @param value the value to set.
   */
  public void setParentRevisionId(java.lang.Long value) {
    this.parent_revision_id = value;
  }

  /**
   * Gets the value of the 'sha1' field.
   * @return The value of the 'sha1' field.
   */
  public java.lang.CharSequence getSha1() {
    return sha1;
  }

  /**
   * Sets the value of the 'sha1' field.
   * @param value the value to set.
   */
  public void setSha1(java.lang.CharSequence value) {
    this.sha1 = value;
  }

  /**
   * Creates a new YaviRevisionMetadata RecordBuilder.
   * @return A new YaviRevisionMetadata RecordBuilder
   */
  public static de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder newBuilder() {
    return new de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder();
  }

  /**
   * Creates a new YaviRevisionMetadata RecordBuilder by copying an existing Builder.
   * @param other The existing builder to copy.
   * @return A new YaviRevisionMetadata RecordBuilder
   */
  public static de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder newBuilder(de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder other) {
    return new de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder(other);
  }

  /**
   * Creates a new YaviRevisionMetadata RecordBuilder by copying an existing YaviRevisionMetadata instance.
   * @param other The existing instance to copy.
   * @return A new YaviRevisionMetadata RecordBuilder
   */
  public static de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder newBuilder(de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata other) {
    return new de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder(other);
  }

  /**
   * RecordBuilder for YaviRevisionMetadata instances.
   */
  public static class Builder extends org.apache.avro.specific.SpecificRecordBuilderBase<YaviRevisionMetadata>
    implements org.apache.avro.data.RecordBuilder<YaviRevisionMetadata> {

    private java.lang.Long page_id;
    private java.lang.Long revision_id;
    private java.lang.Integer day_number;
    private java.lang.Integer contributor_hash;
    private java.lang.Long text_size;
    private java.lang.Long parent_revision_id;
    private java.lang.CharSequence sha1;

    /** Creates a new Builder */
    private Builder() {
      super(SCHEMA$);
    }

    /**
     * Creates a Builder by copying an existing Builder.
     * @param other The existing Builder to copy.
     */
    private Builder(de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder other) {
      super(other);
      if (isValidValue(fields()[0], other.page_id)) {
        this.page_id = data().deepCopy(fields()[0].schema(), other.page_id);
        fieldSetFlags()[0] = true;
      }
      if (isValidValue(fields()[1], other.revision_id)) {
        this.revision_id = data().deepCopy(fields()[1].schema(), other.revision_id);
        fieldSetFlags()[1] = true;
      }
      if (isValidValue(fields()[2], other.day_number)) {
        this.day_number = data().deepCopy(fields()[2].schema(), other.day_number);
        fieldSetFlags()[2] = true;
      }
      if (isValidValue(fields()[3], other.contributor_hash)) {
        this.contributor_hash = data().deepCopy(fields()[3].schema(), other.contributor_hash);
        fieldSetFlags()[3] = true;
      }
      if (isValidValue(fields()[4], other.text_size)) {
        this.text_size = data().deepCopy(fields()[4].schema(), other.text_size);
        fieldSetFlags()[4] = true;
      }
      if (isValidValue(fields()[5], other.parent_revision_id)) {
        this.parent_revision_id = data().deepCopy(fields()[5].schema(), other.parent_revision_id);
        fieldSetFlags()[5] = true;
      }
      if (isValidValue(fields()[6], other.sha1)) {
        this.sha1 = data().deepCopy(fields()[6].schema(), other.sha1);
        fieldSetFlags()[6] = true;
      }
    }

    /**
     * Creates a Builder by copying an existing YaviRevisionMetadata instance
     * @param other The existing instance to copy.
     */
    private Builder(de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata other) {
            super(SCHEMA$);
      if (isValidValue(fields()[0], other.page_id)) {
        this.page_id = data().deepCopy(fields()[0].schema(), other.page_id);
        fieldSetFlags()[0] = true;
      }
      if (isValidValue(fields()[1], other.revision_id)) {
        this.revision_id = data().deepCopy(fields()[1].schema(), other.revision_id);
        fieldSetFlags()[1] = true;
      }
      if (isValidValue(fields()[2], other.day_number)) {
        this.day_number = data().deepCopy(fields()[2].schema(), other.day_number);
        fieldSetFlags()[2] = true;
      }
      if (isValidValue(fields()[3], other.contributor_hash)) {
        this.contributor_hash = data().deepCopy(fields()[3].schema(), other.contributor_hash);
        fieldSetFlags()[3] = true;
      }
      if (isValidValue(fields()[4], other.text_size)) {
        this.text_size = data().deepCopy(fields()[4].schema(), other.text_size);
        fieldSetFlags()[4] = true;
      }
      if (isValidValue(fields()[5], other.parent_revision_id)) {
        this.parent_revision_id = data().deepCopy(fields()[5].schema(), other.parent_revision_id);
        fieldSetFlags()[5] = true;
      }
      if (isValidValue(fields()[6], other.sha1)) {
        this.sha1 = data().deepCopy(fields()[6].schema(), other.sha1);
        fieldSetFlags()[6] = true;
      }
    }

    /**
      * Gets the value of the 'page_id' field.
      * @return The value.
      */
    public java.lang.Long getPageId() {
      return page_id;
    }

    /**
      * Sets the value of the 'page_id' field.
      * @param value The value of 'page_id'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setPageId(java.lang.Long value) {
      validate(fields()[0], value);
      this.page_id = value;
      fieldSetFlags()[0] = true;
      return this;
    }

    /**
      * Checks whether the 'page_id' field has been set.
      * @return True if the 'page_id' field has been set, false otherwise.
      */
    public boolean hasPageId() {
      return fieldSetFlags()[0];
    }


    /**
      * Clears the value of the 'page_id' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearPageId() {
      page_id = null;
      fieldSetFlags()[0] = false;
      return this;
    }

    /**
      * Gets the value of the 'revision_id' field.
      * @return The value.
      */
    public java.lang.Long getRevisionId() {
      return revision_id;
    }

    /**
      * Sets the value of the 'revision_id' field.
      * @param value The value of 'revision_id'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setRevisionId(java.lang.Long value) {
      validate(fields()[1], value);
      this.revision_id = value;
      fieldSetFlags()[1] = true;
      return this;
    }

    /**
      * Checks whether the 'revision_id' field has been set.
      * @return True if the 'revision_id' field has been set, false otherwise.
      */
    public boolean hasRevisionId() {
      return fieldSetFlags()[1];
    }


    /**
      * Clears the value of the 'revision_id' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearRevisionId() {
      revision_id = null;
      fieldSetFlags()[1] = false;
      return this;
    }

    /**
      * Gets the value of the 'day_number' field.
      * @return The value.
      */
    public java.lang.Integer getDayNumber() {
      return day_number;
    }

    /**
      * Sets the value of the 'day_number' field.
      * @param value The value of 'day_number'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setDayNumber(java.lang.Integer value) {
      validate(fields()[2], value);
      this.day_number = value;
      fieldSetFlags()[2] = true;
      return this;
    }

    /**
      * Checks whether the 'day_number' field has been set.
      * @return True if the 'day_number' field has been set, false otherwise.
      */
    public boolean hasDayNumber() {
      return fieldSetFlags()[2];
    }


    /**
      * Clears the value of the 'day_number' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearDayNumber() {
      day_number = null;
      fieldSetFlags()[2] = false;
      return this;
    }

    /**
      * Gets the value of the 'contributor_hash' field.
      * @return The value.
      */
    public java.lang.Integer getContributorHash() {
      return contributor_hash;
    }

    /**
      * Sets the value of the 'contributor_hash' field.
      * @param value The value of 'contributor_hash'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setContributorHash(java.lang.Integer value) {
      validate(fields()[3], value);
      this.contributor_hash = value;
      fieldSetFlags()[3] = true;
      return this;
    }

    /**
      * Checks whether the 'contributor_hash' field has been set.
      * @return True if the 'contributor_hash' field has been set, false otherwise.
      */
    public boolean hasContributorHash() {
      return fieldSetFlags()[3];
    }


    /**
      * Clears the value of the 'contributor_hash' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearContributorHash() {
      contributor_hash = null;
      fieldSetFlags()[3] = false;
      return this;
    }

    /**
      * Gets the value of the 'text_size' field.
      * @return The value.
      */
    public java.lang.Long getTextSize() {
      return text_size;
    }

    /**
      * Sets the value of the 'text_size' field.
      * @param value The value of 'text_size'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setTextSize(java.lang.Long value) {
      validate(fields()[4], value);
      this.text_size = value;
      fieldSetFlags()[4] = true;
      return this;
    }

    /**
      * Checks whether the 'text_size' field has been set.
      * @return True if the 'text_size' field has been set, false otherwise.
      */
    public boolean hasTextSize() {
      return fieldSetFlags()[4];
    }


    /**
      * Clears the value of the 'text_size' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearTextSize() {
      text_size = null;
      fieldSetFlags()[4] = false;
      return this;
    }

    /**
      * Gets the value of the 'parent_revision_id' field.
      * @return The value.
      */
    public java.lang.Long getParentRevisionId() {
      return parent_revision_id;
    }

    /**
      * Sets the value of the 'parent_revision_id' field.
      * @param value The value of 'parent_revision_id'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setParentRevisionId(java.lang.Long value) {
      validate(fields()[5], value);
      this.parent_revision_id = value;
      fieldSetFlags()[5] = true;
      return this;
    }

    /**
      * Checks whether the 'parent_revision_id' field has been set.
      * @return True if the 'parent_revision_id' field has been set, false otherwise.
      */
    public boolean hasParentRevisionId() {
      return fieldSetFlags()[5];
    }


    /**
      * Clears the value of the 'parent_revision_id' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearParentRevisionId() {
      parent_revision_id = null;
      fieldSetFlags()[5] = false;
      return this;
    }

    /**
      * Gets the value of the 'sha1' field.
      * @return The value.
      */
    public java.lang.CharSequence getSha1() {
      return sha1;
    }

    /**
      * Sets the value of the 'sha1' field.
      * @param value The value of 'sha1'.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder setSha1(java.lang.CharSequence value) {
      validate(fields()[6], value);
      this.sha1 = value;
      fieldSetFlags()[6] = true;
      return this;
    }

    /**
      * Checks whether the 'sha1' field has been set.
      * @return True if the 'sha1' field has been set, false otherwise.
      */
    public boolean hasSha1() {
      return fieldSetFlags()[6];
    }


    /**
      * Clears the value of the 'sha1' field.
      * @return This builder.
      */
    public de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata.Builder clearSha1() {
      sha1 = null;
      fieldSetFlags()[6] = false;
      return this;
    }

    @Override
    public YaviRevisionMetadata build() {
      try {
        YaviRevisionMetadata record = new YaviRevisionMetadata();
        record.page_id = fieldSetFlags()[0] ? this.page_id : (java.lang.Long) defaultValue(fields()[0]);
        record.revision_id = fieldSetFlags()[1] ? this.revision_id : (java.lang.Long) defaultValue(fields()[1]);
        record.day_number = fieldSetFlags()[2] ? this.day_number : (java.lang.Integer) defaultValue(fields()[2]);
        record.contributor_hash = fieldSetFlags()[3] ? this.contributor_hash : (java.lang.Integer) defaultValue(fields()[3]);
        record.text_size = fieldSetFlags()[4] ? this.text_size : (java.lang.Long) defaultValue(fields()[4]);
        record.parent_revision_id = fieldSetFlags()[5] ? this.parent_revision_id : (java.lang.Long) defaultValue(fields()[5]);
        record.sha1 = fieldSetFlags()[6] ? this.sha1 : (java.lang.CharSequence) defaultValue(fields()[6]);
        return record;
      } catch (Exception e) {
        throw new org.apache.avro.AvroRuntimeException(e);
      }
    }
  }

  private static final org.apache.avro.io.DatumWriter
    WRITER$ = new org.apache.avro.specific.SpecificDatumWriter(SCHEMA$);

  @Override public void writeExternal(java.io.ObjectOutput out)
    throws java.io.IOException {
    WRITER$.write(this, SpecificData.getEncoder(out));
  }

  private static final org.apache.avro.io.DatumReader
    READER$ = new org.apache.avro.specific.SpecificDatumReader(SCHEMA$);

  @Override public void readExternal(java.io.ObjectInput in)
    throws java.io.IOException {
    READER$.read(this, SpecificData.getDecoder(in));
  }

}
