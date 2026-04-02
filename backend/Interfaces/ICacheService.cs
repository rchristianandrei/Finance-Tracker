namespace backend.Interfaces;

public interface ICacheService
{
    /// <summary>
    /// Retrieves Data if exists
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="key">Unique Identifier</param>
    /// <returns>Returns the stored data</returns>
    Task<T?> GetAsync<T>(string key);

    /// <summary>
    /// Creates a key value pair stored in memory
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="key">Unique Identifier</param>
    /// <param name="value">Stored data</param>
    /// <param name="expiry">TTL</param>
    /// <returns></returns>
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);

    /// <summary>
    /// Removes the key value pair
    /// </summary>
    /// <param name="key">Unique Identifier</param>
    /// <returns></returns>
    Task RemoveAsync(string key);
}
