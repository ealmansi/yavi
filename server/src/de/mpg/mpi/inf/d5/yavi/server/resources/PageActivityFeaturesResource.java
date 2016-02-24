package de.mpg.mpi.inf.d5.yavi.server.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.JSONP;

import de.mpg.mpi.inf.d5.yavi.server.PageActivityFeatures;
import de.mpg.mpi.inf.d5.yavi.server.beans.PageActivityFeaturesVector;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;

@Path("/pageactivityfeatures")
@Produces("application/x-javascript")
public class PageActivityFeaturesResource {
  
  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public PageActivityFeaturesVector doGet(@QueryParam("pageid") int pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    if (pageId > 0 &&
        ResourceUtil.isValidWikipediaId(wikipediaId) &&
        ResourceUtil.isValidPeriod(dayFrom, dayTo)) {
      return PageActivityFeatures.getPageActivityFeaturesVector(pageId,
                                                                wikipediaId,
                                                                dayFrom,
                                                                dayTo);
    }
    throw new WebApplicationException(Response.Status.BAD_REQUEST);
  }
}

