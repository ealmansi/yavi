package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParser;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;
import org.xml.sax.InputSource;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportParser;

/**
 * YaviPageWikilinksExport
 */
public class YaviPageWikilinksExport {
  private static final ArgumentParser argParser;

  static {
    argParser =
        ArgumentParsers
            .newArgumentParser(YaviPageWikilinksExport.class.getSimpleName().toLowerCase())
            .description("A tool for parsing Wikipedia XML dumps into Avro format.")
            .epilog("Reads from standard input, expecting XML from a current pages Wikipedia dump.\n" +
                        "\tOutputs a file with an avro collection of page wikilinks.");
    argParser
        .addArgument("-o", "--page-wikilinks-output-file")
        .required(true)
        .type(String.class)
        .help("File where the avro collection of page wikilinks will be stored.");
  }

  public static void main(String[] args) throws WikipediaExportException, IOException {
    // Read command-line arguments.
    String pageWikilinksOutputFile = null;
    try {
      Namespace namespace = argParser.parseArgs(args);
      pageWikilinksOutputFile = namespace.get("page_wikilinks_output_file");
    } catch (ArgumentParserException e) {
      argParser.handleError(e);
      System.exit(1);
    }

    // Generate input source from stdin.
    BufferedInputStream stdinBufferedInputStream = new BufferedInputStream(System.in);
    Reader stdinReader = new InputStreamReader(stdinBufferedInputStream);
    InputSource stdinInputSource = new InputSource(stdinReader);

    // Generate export handler and run parser.
    WikipediaExportHandler exportHandler =
        new YaviPageWikilinksExportHandler(pageWikilinksOutputFile);
    WikipediaExportParser.parse(stdinInputSource, exportHandler);
  }
}
