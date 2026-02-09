import styles from "./ie-warning.module.css";

function IEWarning() {
  return (
    <div className={styles["ie-warning"]}>
      <p>
        Your browser <b>Internet Explorer</b> is no longer supported by our
        service.
      </p>
      <p>
        <b>We recommend using a different browser</b>
      </p>
    </div>
  );
}

export default IEWarning;
