package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import de.mpg.mpi.inf.d5.yavi.wikipedia.export.schemas.YaviPageWikilink;

import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaPageMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionText;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;

import org.apache.avro.file.DataFileWriter;

import java.io.IOException;

import java.util.List;

/**
 * YaviPageWikilinksExportHandler
 */
public class YaviPageWikilinksExportHandler extends WikipediaExportHandler {
  /**
   * State kept during export.
   */
  private final String pageWikilinksOutputFile;
  private DataFileWriter<YaviPageWikilink> pageWikilinksDataFileWriter;
  private WikipediaPageMetadata pageMetadata;
  private WikipediaRevisionText revisionText;

  /**
   * YaviPageWikilinksExportHandler
   */
  public YaviPageWikilinksExportHandler(String pageWikilinksOutputFile) {
    this.pageWikilinksOutputFile = pageWikilinksOutputFile;
  }

  /**
   * startExport
   */
  @Override
  protected void startExport() throws WikipediaExportException {
    try {
      pageWikilinksDataFileWriter = YaviExportHandlerUtil.getDataFileWriter(pageWikilinksOutputFile,
                                                        YaviPageWikilink.class,
                                                        YaviPageWikilink.getClassSchema());
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
      pageWikilinksDataFileWriter.close();
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
    this.revisionText = revisionText;
  }

  /**
   * endRevisionText
   */
  @Override
  protected void endRevisionText() throws WikipediaExportException {
    if (pageMetadata.getNs() == 0) {
      List<CharSequence> wikilinks =
          YaviWikilinksExtractor.extractWikilinks(revisionText.getText());
      try {
        for (CharSequence wikilink : wikilinks) {
          pageWikilinksDataFileWriter.append(new YaviPageWikilink(pageMetadata.getId(),
                                                                  wikilink));
        }
      } catch (IOException e) {
        throw new WikipediaExportException("Appending page wikilink failed.", e);
      }
    }
  }
}
