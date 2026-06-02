using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Dtos;

public class QueryParameters
{
   public string? Search { get; set; } = string.Empty;

   [JsonIgnore]
   public DateTimeOffset? StartDate { get; set; }

   [JsonIgnore]
   public DateTimeOffset? EndDate { get; set; }

   private int? _page;
   [Range(1, int.MaxValue)]
   public int? Page
   {
      get => _page;
      set => _page = value <= 0 ? null : value;
   }

   private int? _pageSize;
   [Range(1, 20)]
   public int? PageSize
   {
      get => _pageSize;
      set => _pageSize = (value is null or <= 0) ? null : value;
   }

   [BindNever]
   public int PageOrDefault => Page ?? 1;

   [BindNever]
   public int PageSizeOrDefault => PageSize ?? 10;
}
