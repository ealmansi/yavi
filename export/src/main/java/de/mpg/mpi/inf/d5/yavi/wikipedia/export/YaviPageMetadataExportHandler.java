package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviPageMetadata;

import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaPageMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionText;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;

import org.apache.avro.file.DataFileWriter;

import java.io.IOException;

/**
 * YaviPageMetadataExportHandler
 */
public class YaviPageMetadataExportHandler extends WikipediaExportHandler {
  /**
   * State kept during export.
   */
  private final String pageMetadataOutputFile;
  private DataFileWriter<YaviPageMetadata> pageMetadataDataFileWriter;
  private WikipediaPageMetadata pageMetadata;

  /**
   * YaviPageMetadataExportHandler
   */
  public YaviPageMetadataExportHandler(String pageMetadataOutputFile) {
    this.pageMetadataOutputFile = pageMetadataOutputFile;
  }

  /**
   * startExport
   */
  @Override
  protected void startExport() throws WikipediaExportException {
    try {
      pageMetadataDataFileWriter = YaviExportHandlerUtil.getDataFileWriter(pageMetadataOutputFile,
                                                        YaviPageMetadata.class,
                                                        YaviPageMetadata.getClassSchema());
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
      pageMetadataDataFileWriter.close();
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
    try {
      if (pageMetadata.getNs() == 0) {
        pageMetadataDataFileWriter.append(new YaviPageMetadata(pageMetadata.getId(),
                                                                pageMetadata.getTitle(),
                                                                pageMetadata.getRedirect()));
      }
    } catch (IOException e) {
      throw new WikipediaExportException("Appending page metadata failed.", e);
    }
  }

  /**
   * startRevisionMetadata
   */
  @Override
  protected void startRevisionMetadata(WikipediaRevisionMetadata revisionMetadata)
      throws WikipediaExportException {
  }

  /**
   * endRevisionMetadata
   */
  @Override
  protected void endRevisionMetadata() throws WikipediaExportException {
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
}
