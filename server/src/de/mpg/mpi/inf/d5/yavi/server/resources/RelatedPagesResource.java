package de.mpg.mpi.inf.d5.yavi.server.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.glassfish.jersey.server.JSONP;

import de.mpg.mpi.inf.d5.yavi.server.RelatedPages;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;
import de.mpg.mpi.inf.d5.yavi.server.util.PageIdScore;

@Path("/relatedpages")
@Produces("application/x-javascript")
public class RelatedPagesResource {
  RelatedPages relatedPages = new RelatedPages();
  
  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public List<PageIdScore> doGet(@QueryParam("pageid") long pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    return relatedPages.getTopRelatedPages(pageId, wikipediaId, dayFrom, dayTo);
  }
}
