using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Dtos;

public class TransactionQueryParameters
{
   public string? Search { get; set; } = string.Empty;

   public DateTime? StartDate { get; set; } = DateTime.Now;

   public DateTime? EndDate { get; set; } = DateTime.Now;

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
