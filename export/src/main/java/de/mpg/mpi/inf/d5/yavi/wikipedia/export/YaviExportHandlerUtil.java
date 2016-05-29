package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaPageMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionMetadata;
import de.mpg.mpi.inf.d5.wikipedia.export.schemas.WikipediaRevisionText;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;

import org.apache.avro.Schema;
import org.apache.avro.file.CodecFactory;
import org.apache.avro.file.DataFileWriter;
import org.apache.avro.io.DatumWriter;
import org.apache.avro.specific.SpecificDatumWriter;

import java.io.File;
import java.io.IOException;

import java.util.ArrayList;
import java.util.List;

/**
 * YaviExportHandlerUtil
 */
public class YaviExportHandlerUtil {

  /**
   * getDataFileWriter
   */
  public static <T> DataFileWriter<T> getDataFileWriter(String outputFile,
                                                    Class<T> avroClass,
                                                    Schema avroSchema) throws IOException {
    DatumWriter<T> datumWriter = new SpecificDatumWriter<>(avroClass);
    DataFileWriter<T> dataFileWriter = new DataFileWriter<>(datumWriter);
    dataFileWriter.setCodec(CodecFactory.snappyCodec());
    return dataFileWriter.create(avroSchema, new File(outputFile));
  }
}
