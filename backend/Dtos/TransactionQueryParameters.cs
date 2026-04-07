using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Dtos;

public class TransactionQueryParameters
{
   public string? Search { get; set; } = string.Empty;

   [JsonIgnore]
   private DateTime? _startDate { get; set; } = DateTime.Now;
   public DateTime? StartDate
   {
      get => _startDate;
      set => _startDate = value == null
          ? DateTime.UtcNow
          : value.Value.Kind == DateTimeKind.Utc
              ? value.Value
              : value.Value.ToUniversalTime();
   }

   [JsonIgnore]
   private DateTime? _endDate { get; set; } = DateTime.Now;
   public DateTime? EndDate
   {
      get => _endDate;
      set => _endDate = value == null
          ? DateTime.UtcNow
          : value.Value.Kind == DateTimeKind.Utc
              ? value.Value
              : value.Value.ToUniversalTime();
   }

   private int? _page;
   [Range(1, int.MaxValue)]
   public int? Page
   {
      get => _page;
      set => _page = value <= 0 ? null : value;
   }

   private int? _pageSize;
   [Range(1, 10)]
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
