export function PasswordStrengthIndicator({ strength }: { strength: number }) {
    return (
      <div className="mt-2 flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-full rounded ${i < strength ? 'bg-green-500' : 'bg-gray-200'}`}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">
          Password strength: {strength} out of 4
        </span>
      </div>
    );
  }