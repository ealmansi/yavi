package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviRevisionMetadata;

import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaPageMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionText;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;

import org.apache.avro.file.DataFileWriter;

import java.io.IOException;

/**
 * YaviRevisionMetadataExportHandler
 */
public class YaviRevisionMetadataExportHandler extends WikipediaExportHandler {
  /**
   * State kept during export.
   */
  private final String revisionMetadataOutputFile;
  private DataFileWriter<YaviRevisionMetadata> revisionMetadataDataFileWriter;
  private WikipediaPageMetadata pageMetadata;
  private WikipediaRevisionMetadata revisionMetadata;

  /**
   * YaviRevisionMetadataExportHandler
   */
  public YaviRevisionMetadataExportHandler(String revisionMetadataOutputFile) {
    this.revisionMetadataOutputFile = revisionMetadataOutputFile;
  }

  /**
   * startExport
   */
  @Override
  protected void startExport() throws WikipediaExportException {
    try {
      revisionMetadataDataFileWriter =
          YaviExportHandlerUtil.getDataFileWriter(revisionMetadataOutputFile,
                                                  YaviRevisionMetadata.class,
                                                  YaviRevisionMetadata.getClassSchema());
    } catch (IOException e) {
      throw new WikipediaExportException("Opening Avro data file writers failed.", e);
    }
  }

  /**
   * endExport
   */
  @Override
  protected void endExport() throws WikipediaExportException {
    try {
      revisionMetadataDataFileWriter.close();
    } catch (IOException e) {
      throw new WikipediaExportException("Closing Avro data file writers failed.", e);
    }
  }

  /**
   * startPageMetadata
   */
  @Override
  protected void startPageMetadata(WikipediaPageMetadata pageMetadata)
      throws WikipediaExportException {
    this.pageMetadata = pageMetadata;
  }

  /**
   * endPageMetadata
   */
  @Override
  protected void endPageMetadata() throws WikipediaExportException {
    this.pageMetadata = null;
  }

  /**
   * startRevisionMetadata
   */
  @Override
  protected void startRevisionMetadata(WikipediaRevisionMetadata revisionMetadata)
      throws WikipediaExportException {
    this.revisionMetadata = revisionMetadata;
  }

  /**
   * endRevisionMetadata
   */
  @Override
  protected void endRevisionMetadata() throws WikipediaExportException {
    try {
      if (pageMetadata.getNs() == 0) {
        Long pageId = pageMetadata.getId();
        Long revisionId = revisionMetadata.getId();
        Integer dayNumber = null;
        if (revisionMetadata.getTimestamp() != null) {
          dayNumber = YaviDates.timestampToDayNumber(revisionMetadata.getTimestamp().toString());
        }
        Integer contributorHash = computeContributorHash(revisionMetadata);
        Long textSize = revisionMetadata.getTextSize();
        Long parentRevisionId = revisionMetadata.getParentId();
        CharSequence sha1 = revisionMetadata.getSha1();
        revisionMetadataDataFileWriter.append(new YaviRevisionMetadata(pageId,
                                                                        revisionId,
                                                                        dayNumber,
                                                                        contributorHash,
                                                                        textSize,
                                                                        parentRevisionId,
                                                                        sha1));
      }
    } catch (IOException e) {
      throw new WikipediaExportException("Appending revision metadata failed.", e);
    }
  }

  /**
   * startRevisionText
   */
  @Override
  protected void startRevisionText(WikipediaRevisionText revisionText)
      throws WikipediaExportException {
  }

  /**
   * endRevisionText
   */
  @Override
  protected void endRevisionText() throws WikipediaExportException {
  }
  
  /**
   * Utility.
   */
  private int computeContributorHash(WikipediaRevisionMetadata revisionMetadata) {
    StringBuilder contributorKeyBuilder = new StringBuilder();
    if (revisionMetadata.getContributorUsername() != null) {
      contributorKeyBuilder.append(revisionMetadata.getContributorUsername());
    }
    contributorKeyBuilder.append("|");
    if (revisionMetadata.getContributorId() != null) {
      contributorKeyBuilder.append(revisionMetadata.getContributorId());
    }
    contributorKeyBuilder.append("|");
    if (revisionMetadata.getContributorIp() != null) {
      contributorKeyBuilder.append(revisionMetadata.getContributorIp());
    }
    contributorKeyBuilder.append("|");
    String contributorKey = contributorKeyBuilder.toString();
    int contributorHash = 0;
    if (!contributorKey.equals("|||")) {
      contributorHash = contributorKey.hashCode();
    }
    return contributorHash;
  }
}
