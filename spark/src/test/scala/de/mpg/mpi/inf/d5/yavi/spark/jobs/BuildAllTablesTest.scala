package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.AddedInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.AddedOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NonRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfAddedInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfAddedOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfTotalInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfTotalOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfUniqueEditors
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageContentSize
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageDays
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PreviousDay
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedInlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedOutlinks
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleRedirection
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleToPageId

/**
 * BuildAllTablesTest
 */
class BuildAllTablesTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildAllTables.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(TitleRedirection).show
    JobContextMock.getDataFrame(TitleToPageId).show
    JobContextMock.getDataFrame(RevertedRevisions).show
    JobContextMock.getDataFrame(NonRevertedRevisions).show
    JobContextMock.getDataFrame(PageDays).show
    JobContextMock.getDataFrame(PreviousDay).show
    JobContextMock.getDataFrame(PageOutlinks).show
    JobContextMock.getDataFrame(PageInlinks).show
    JobContextMock.getDataFrame(AddedOutlinks).show
    JobContextMock.getDataFrame(RemovedOutlinks).show
    JobContextMock.getDataFrame(AddedInlinks).show
    JobContextMock.getDataFrame(RemovedInlinks).show
    JobContextMock.getDataFrame(NumberOfRevisions).show
    JobContextMock.getDataFrame(NumberOfRevertedRevisions).show
    JobContextMock.getDataFrame(NumberOfUniqueEditors).show
    JobContextMock.getDataFrame(PageContentSize).show
    JobContextMock.getDataFrame(NumberOfTotalOutlinks).show
    JobContextMock.getDataFrame(NumberOfAddedOutlinks).show
    JobContextMock.getDataFrame(NumberOfAddedInlinks).show

    // Clear created tables.
    JobContextMock.clear()
  }
}
